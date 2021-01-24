import { filterXSS } from 'xss';
import { IField, Validator } from '../framework/validator';

const titleLength = 255;
const bodyLength = 1048576;
const limitPagi = 10;
const defaultOffset = 0;

export const createUuid = (name: string): IField => {
  return {
    name,
    location: 'params',
    type: 'string',
    require: true,
    validator: (v: string) => /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(v),
    message: `Invalid UUID value`,
  };
};

export const UuidValidator = new Validator(createUuid('uuid'));

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
    require: false,
    validator: (v: string[]) => v.every((e) => typeof e === 'string' && /^[a-zA-Z0-9]{3,32}$/.test(e)),
    message: 'Tag is only non-special characters length between 3-32 characters',
  },
);

export const CommentValidator = new Validator(createUuid('uuid'), {
  name: 'content',
  location: 'body',
  type: 'string',
  require: true,
  validator: (v: string) => v.length < bodyLength,
  postProcess: (v: string) => filterXSS(v),
  message: `Body should contain less than ${bodyLength}`,
});

const LimitPagiValidator: IField = {
  name: 'limit',
  location: 'body',
  type: 'number',
  defaultValue: limitPagi,
  require: true,
  validator: (v: number) => /^[1-9]+[0-9]*$/.test(v.toString()) && v <= limitPagi,
  message: 'Invalid limit number',
};

const OffsetPagiValidator: IField = {
  name: 'offset',
  location: 'body',
  type: 'number',
  defaultValue: defaultOffset,
  require: true,
  validator: (v: number) => /^[1-9]+[0-9]*$/.test(v.toString()),
  message: 'Invalid offset number',
};

const OrderPagiValidator: IField = {
  name: 'order',
  location: 'body',
  type: 'array',
  defaultValue: [
    { column: 'updated', order: 'desc' },
    { column: 'created', order: 'desc' },
  ],
  validator: (v: object[]) => v.every((e) => typeof e === 'object'),
  require: true,
  message: 'Invalid order type',
};

export const ArticleUuidValidator = new Validator(
  createUuid('articleUuid'),
  LimitPagiValidator,
  OffsetPagiValidator,
  OrderPagiValidator,
);

export const CommentUuidValidator = new Validator(
  createUuid('commentUuid'),
  LimitPagiValidator,
  OffsetPagiValidator,
  OrderPagiValidator,
);

export default {
  UuidValidator,
  ArticleUuidValidator,
  CommentUuidValidator,
  ArticleValidator,
  CommentValidator,
};
