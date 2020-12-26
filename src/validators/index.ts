import { filterXSS } from 'xss';
import { Validator } from '../framework/validator';

const titleLength = 255;
const bodyLength = 1048576;

export const UuidValidator = new Validator({
  name: 'uuid' || 'commentUuid' || 'articleUuid',
  location: 'params',
  type: 'string',
  require: true,
  validator: (v: string) => /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(v),
  message: `Invalid UUID value`,
});

export const ArticleValidator = new Validator(
  {
    name: 'title',
    location: 'body',
    type: 'string',
    require: true,
    validator: (v: string) => v.length < titleLength,
    postProcess: (v: string) => filterXSS(v),
    message: `Title should contain less than ${titleLength} characters`,
  },
  {
    name: 'content',
    location: 'body',
    type: 'string',
    require: true,
    validator: (v: string) => v.length < bodyLength,
    postProcess: (v: string) => filterXSS(v),
    message: `Body should contain less than ${bodyLength}`,
  },
  {
    name: 'tags',
    location: 'body',
    type: 'array',
    require: true,
    validator: (v: string[]) => v.every((e) => typeof e === 'string' && /^[a-zA-Z0-9]{3,32}$/.test(e)),
    message: 'Tag is only non-special characters length between 3-32 characters',
  },
);

export const ArticleUuidValidator = new Validator({
  name: 'articleUuid',
  location: 'params',
  type: 'string',
  require: true,
  validator: (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89AB][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v),
  message: `Invalid UUID value`,
});

export const CommentUuidValidator = new Validator({
  name: 'articleUuid',
  location: 'params',
  type: 'string',
  require: true,
  validator: (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89AB][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v),
  message: `Invalid UUID value`,
});

export const CommentValidator = new Validator({
  name: 'content',
  location: 'body',
  type: 'string',
  require: true,
  validator: (v: string) => v.length < bodyLength,
  message: `Body should contain less than ${bodyLength}`,
});

export default {
  ArticleValidator,
  UuidValidator,
  ArticleUuidValidator,
  CommentUuidValidator,
  CommentValidator,
};
