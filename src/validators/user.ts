import ValidatorJs from 'validator';
import { Validator } from '../framework';
import { TitleLength } from './constant';

export const ValidatorEmail = new Validator({
  name: 'email',
  location: 'body',
  type: 'string',
  require: true,
  validator: (v: string) => ValidatorJs.isEmail(v),
  message: `Title should contain less than ${TitleLength} characters`,
});

export const ValidatorSignedChallengeKey = new Validator({
  name: 'signedChallengeKey',
  location: 'body',
  type: 'string',
  require: true,
  validator: (v: string) => /^[a-f0-9]{232,256}$/i.test(v),
  message: 'Signed challenge key should be a hex string',
});

export default ValidatorEmail;
