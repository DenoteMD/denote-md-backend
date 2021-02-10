import { IField, Validator } from '../framework';
import { ValidatorPagination } from './pagination';
import { BodyLength } from './constant';
import { CreateUuidField } from './common';

const ValidatorCommentObject: IField = {
  name: 'content',
  location: 'body',
  type: 'string',
  require: true,
  validator: (v: string) => v.length < BodyLength,
  message: `Body should contain less than ${BodyLength}`,
};

export const ValidatorGetComment = new Validator(CreateUuidField('commentUuid')).merge(ValidatorPagination);

export const ValidatorComment = new Validator(CreateUuidField('articleUuid'), ValidatorCommentObject);

export const ReplyValidatorComment = new Validator(
  CreateUuidField('commentUuid'),
  CreateUuidField('articleUuid'),
  ValidatorCommentObject,
);

export const CommentUuidValidator = new Validator(CreateUuidField('commentUuid'));
export const ArticleUuidValidator = new Validator(CreateUuidField('articleUuid'));
