import crypto from 'crypto';
import { DenoteUserIdentity } from 'denote-ui';
import { Buffer } from 'safe-buffer';
import moment from 'moment';
import { ISession, ModelSession } from '../model/session';
import { IDocumentUser, ModelUser } from '../model/user';
import logger from '../helper/logger';

export interface IUserChallenge {
  userModel: IDocumentUser;
  challengeKey: string;
  expiredDate: Date;
}

export class CoreAuthenticator {
  public static generateChallenge() {
    // Generate a random byte array and transform them to hex string
    return crypto.randomBytes(32).toString('hex');
  }

  public static async generateChallengeByUserEmail(email: string): Promise<IUserChallenge> {
    // Find user by their email
    const imUser = await ModelUser.findOne({ email }).exec();
    if (imUser) {
      const expiredDate = moment(new Date()).add(1, 'day').toDate();
      const challengeKey = CoreAuthenticator.generateChallenge();
      // Create new session with given challenge string
      const imSession = new ModelSession(<ISession>{
        userId: imUser.id,
        challengeKey,
        expiredDate,
      });
      // We will save this session, if user want to login they must sign
      // The challenge value with their key
      await imSession.save();
      return {
        userModel: imUser,
        challengeKey,
        expiredDate,
      };
    }
    throw new Error('User not found in our system');
  }

  public static async verifySignedProof(signedProof: string): Promise<boolean> {
    // Verify signed proof from browser
    const { message, nonce, signer } = DenoteUserIdentity.verifySignedProof(Buffer.from(signedProof, 'hex'));
    // eslint-disable-next-line no-bitwise
    const timestamp = (Date.now() / 1000) >>> 0;
    logger.debug('Found message:', message);
    logger.debug('New message signed by:', signer, 'time:', timestamp - nonce, 's ago');
    if (timestamp - nonce > 300) {
      logger.error('Invalid proof, it was singed more than 5 mins ago');
      return false;
    }
    const imSession = await ModelSession.findOne({ challengeKey: message }).exec();
    if (imSession) {
      if (typeof imSession.sessionKeyId === 'undefined') {
        imSession.sessionKeyId = signer;
        await imSession.save();
        return true;
      }
      if (typeof imSession.sessionKeyId === 'string' && imSession.sessionKeyId === signer) {
        return true;
      }
    }
    logger.error('Challenge key does not exist or challenge key used');
    return false;
  }
}

export default CoreAuthenticator;
