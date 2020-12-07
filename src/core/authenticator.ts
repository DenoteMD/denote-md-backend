import crypto from 'crypto';
import { DenoteUserIdentity } from 'denote-ui';
import { Buffer } from 'safe-buffer';
import express from 'express';
import moment from 'moment';
import { IDocumentSession, ModelSession } from '../model/session';
import { IDocumentUser, IUser, ModelUser } from '../model/user';
import logger from '../helper/logger';
import { IMuxRequest, IMuxResponse } from '../framework/mux';

// How many mins for signed proof to be invalid, 5 mins
const challengeProofTtl = 5;
// Time for challenge to be invalid 15 mins
const challengeExpireTime = 15;

/**
 * User's challenge interface
 * @export
 * @interface IUserChallenge
 */
export interface IUserChallenge {
  /**
   * User who requested for challenge
   * @type {IDocumentUser}
   * @memberof IUserChallenge
   */
  userModel: IDocumentUser;

  /**
   * A randomized hex string
   * @type {string}
   * @memberof IUserChallenge
   */
  challengeKey: string;

  /**
   * Time for this challenge to be expired, It used to 1 day or forever
   * depend on user's choice
   * @type {Date}
   * @memberof IUserChallenge
   */
  expiredDate: Date;
}

/**
 * Core authenticator based on DenoteUI
 * @export
 * @class CoreAuthenticator
 */
export class CoreAuthenticator {
  /**
   * Generate a challenge string
   * @static
   * @return {*}
   * @memberof CoreAuthenticator
   */
  public static generateChallenge() {
    // Generate a random byte array and transform them to hex string
    return crypto.randomBytes(32).toString('hex');
  }

  private static sendError(res: IMuxResponse, message: string) {
    res.send(
      JSON.stringify({
        success: false,
        result: {
          message,
        },
      }),
    );
  }

  /**
   * Generate challenge by user's email and add new document to session collection
   * @static
   * @param {string} email
   * @return {Promise<IUserChallenge>}
   * @memberof CoreAuthenticator
   */
  public static async generateChallengeByUserEmail(email: string): Promise<IUserChallenge> {
    // Find user by their email
    const imUser = await ModelUser.findOne({ email }).exec();
    if (imUser) {
      // Set expire date to next 30 days
      const expiredDate = moment(new Date()).add(30, 'day').toDate();
      // Generate random challenge
      const challengeKey = CoreAuthenticator.generateChallenge();
      // Create new session with given challenge string
      const imSession = new ModelSession({
        userId: imUser.id,
        challengeKey,
        expiredDate,
      });
      // We will save this session, if user want to login they must sign
      // the challenge value with their key
      await imSession.save();
      return {
        userModel: imUser,
        challengeKey,
        expiredDate,
      };
    }
    throw new Error('User not found in our system');
  }

  /**
   * Verify signed proof from user
   * @static
   * @param {string} signedProof
   * @return {Promise<boolean>}
   * @memberof CoreAuthenticator
   */
  public static async verifySignedProof(signedProof: string): Promise<boolean> {
    // Verify signed proof from browser
    const { message, nonce, signer } = DenoteUserIdentity.verifySignedProof(Buffer.from(signedProof, 'hex'));
    // eslint-disable-next-line no-bitwise
    logger.debug('Found message:', message);
    logger.debug('New message signed by:', signer, moment.unix(nonce).fromNow());
    // Make sure that given proof wasn't signed a long time ago
    if (moment.unix(nonce).diff(Date.now(), 'minutes') > challengeProofTtl) {
      logger.error('Invalid proof, it was signed more than 5 mins ago');
      return false;
    }
    const imSession = await ModelSession.findOne({ challengeKey: message }).exec();
    if (imSession) {
      if (typeof imSession.sessionKeyId === 'undefined') {
        // Time for challenger is run out and sessionKeyId still undefined
        if (moment(imSession.created).diff(Date.now(), 'minutes') > challengeExpireTime) {
          throw new Error('This challenge is expired');
        }
        imSession.sessionKeyId = signer;
        await imSession.save();
        return true;
      }
      if (typeof imSession.sessionKeyId === 'string' && imSession.sessionKeyId === signer) {
        return true;
      }
    }
    logger.error('Challenge key does not exist or challenge key was used');
    return false;
  }

  public static async getSessionByKeyId(sessionKeyId: string): Promise<IDocumentSession | null> {
    return ModelSession.findOne({ sessionKeyId }).populate('user');
  }

  // eslint-disable-next-line consistent-return
  public static authenticationMiddleWare(req: IMuxRequest, res: IMuxResponse, next: express.NextFunction): void {
    const denoteUiBase64Signature = req.header('X-Denote-User-Identity');
    if (denoteUiBase64Signature) {
      const signature = Buffer.from(denoteUiBase64Signature, 'base64');
      const { message, signer, nonce } = DenoteUserIdentity.verifySignedProof(signature);
      logger.debug('Message:', message);
      logger.debug('signer:', signer, 'singed time:', moment.unix(nonce).fromNow());
      // Handle empty request data
      if (message !== 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' && req.body) {
        const dataDigest = crypto.createHash('sha256').update(JSON.stringify(req.body)).digest('hex');
        logger.debug('Digest of data:', dataDigest);
        if (dataDigest !== message) {
          CoreAuthenticator.sendError(res, 'Digest mismatch something when wrong here');
          return next();
        }
      }
      // Get session from database then add to req.session
      CoreAuthenticator.getSessionByKeyId(signer).then(
        (result: IDocumentSession | null) => {
          req.session = result;
          logger.debug('Session info:', result);
          logger.info('User is valid:', signer, (<IUser>(<any>result?.user)).uuid);
          next();
        },
        (err: Error) => {
          CoreAuthenticator.sendError(res, 'Might be session was no exist or data mismatch');
          logger.error('Core authentication found an error:', err);
          next();
        },
      );
    } else {
      // Missing header or wrong type of header
      CoreAuthenticator.sendError(res, 'You were not authenticated, you shall not pass');
      next();
    }
  }
}

export default CoreAuthenticator;
