import moment from 'moment';
import { IRequestData, Mux, IResponseRecord, IMuxRequest } from '../framework';
import { ValidatorEmail, ValidatorSignedChallengeKey } from '../validators';
import { ModelUser } from '../model/user';
import { ModelSession } from '../model/session';
import { CoreAuthenticator, AwsMailInstance } from '../core';
import logger from '../helper/logger';

interface IUserMessage {
  message: string;
}

Mux.post<IUserMessage>(
  '/v1/user/sign-in',
  ValidatorEmail,
  async (requestData: IRequestData): Promise<IResponseRecord<IUserMessage>> => {
    // @dev-security We might need to take care email flood scenario
    const { email } = requestData.body;
    const user = await ModelUser.findOne({ email });
    if (!user) {
      // User wasn't exist send an email to user
      // Allow user to register with given email
      const imUser = new ModelUser({ email, alias: email });
      await imUser.save();
    }
    // Generate a random challenge and send to user's given email
    const { challengeKey, expiredDate, userModel } = await CoreAuthenticator.generateChallengeByUserEmail(email);
    AwsMailInstance.sendEmail(
      'no-reply@denotemd.com',
      email,
      '[DenoteMD] Sign-in email',
      '<nohtml/>',
      `Dir ${
        userModel.uuid
      },\nAre you try to login?, here is your challenge link http://denotemd.com/user/sign-in/${challengeKey} will bexpired after ${moment(
        expiredDate,
      ).fromNow()} (${expiredDate.toLocaleString()})\n Here is challenge key: ${challengeKey}`,
    );
    return {
      success: true,
      result: {
        message: `We will send a sign-in link to your email: ${email}`,
      },
    };
  },
);

Mux.post<IUserMessage>(
  '/v1/user/sign-in/verify',
  ValidatorSignedChallengeKey,
  async (requestData: IRequestData): Promise<IResponseRecord<IUserMessage>> => {
    const { signedChallengeKey } = requestData.body;
    if (signedChallengeKey && CoreAuthenticator.verifySignedProof(signedChallengeKey)) {
      return {
        success: true,
        result: {
          message: `You have been signed in`,
        },
      };
    }
    throw new Error('We have found error in the verification');
  },
);

Mux.get<IUserMessage>(
  '/v1/user/sign-out',
  undefined,
  async (_requestData: IRequestData, req?: IMuxRequest): Promise<IResponseRecord<IUserMessage>> => {
    if (req && req.session && req.session.isAuthenticated()) {
      const sessionUuid = req.session.getSession().uuid;
      logger.info('Removed session:', sessionUuid);
      await ModelSession.deleteOne({ uuid: sessionUuid });
    }
    return {
      success: true,
      result: {
        message: 'You have been signed out',
      },
    };
  },
);
