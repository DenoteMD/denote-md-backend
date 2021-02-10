import { Validator } from '../framework';
import { ValidatorPagination } from './pagination';
import { TitleLength, BodyLength } from './constant';
import { CreateUuidField } from './common';

export const ValidatorArticle = new Validator(
  {
    name: 'title',
    location: 'body',
    type: 'string',
    require: true,
    validator: (v: string) => v.length < TitleLength,
    message: `Title should contain less than ${TitleLength} characters`,
  },
  {
    name: 'content',
    location: 'body',
    type: 'string',
    require: true,
    validator: (v: string) => v.length < BodyLength,
    message: `Body should contain less than ${BodyLength}`,
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

export const ValidatorGetArticle = new Validator(CreateUuidField('articleUuid')).merge(ValidatorPagination);
