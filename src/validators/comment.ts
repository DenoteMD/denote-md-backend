import { IField, Validator } from '../framework/validator';
import { PaginationValidator } from './pagination';
import { BodyLength } from './constant';
import { CreateUuidField } from './common';

const CommentObjectValidator: IField = {
  name: 'content',
  location: 'body',
  type: 'string',
  require: true,
  validator: (v: string) => v.length < BodyLength,
  message: `Body should contain less than ${BodyLength}`,
};

export const GetCommentValidator = new Validator(CreateUuidField('commentUuid')).merge(PaginationValidator);

export const CommentValidator = new Validator(CreateUuidField('articleUuid'), CommentObjectValidator);

export const ReplyCommentValidator = new Validator(
  CreateUuidField('commentUuid'),
  CreateUuidField('articleUuid'),
  CommentObjectValidator,
);

export const CommentUuidValidator = new Validator(CreateUuidField('commentUuid'));
export const ArticleUuidValidator = new Validator(CreateUuidField('articleUuid'));
