import ValidatorJs from 'validator';
import { Validator } from '../framework';
import { TitleLength } from './constant';

export const EmailValidator = new Validator({
  name: 'email',
  location: 'body',
  type: 'string',
  require: true,
  validator: (v: string) => ValidatorJs.isEmail(v),
  message: `Title should contain less than ${TitleLength} characters`,
});

export default EmailValidator;
