import { Validator } from '../framework';
import { DefaultPagination } from './constant';

export const ValidatorPagination = new Validator(
  {
    name: 'limit',
    location: 'query',
    type: 'number',
    defaultValue: DefaultPagination.limit,
    validator: (v: number) => Number.isInteger(v) && v <= DefaultPagination.limit,
    message: 'Invalid limit number',
  },
  {
    name: 'offset',
    location: 'query',
    type: 'number',
    validator: (v: number) => Number.isInteger(v),
    message: 'Invalid offset number',
  },
  {
    name: 'order',
    location: 'query',
    type: 'array',
    defaultValue: [],
    validator: (v: any[]) =>
      v.every((e: any) => typeof e === 'object' && e.column && e.order && ['asc', 'desc'].includes(e.order)),
    message: 'Invalid order type',
  },
);

export default ValidatorPagination;
