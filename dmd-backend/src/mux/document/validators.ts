import { Validator, FieldLocation, FieldType } from '../../framework/validator';

const getListDocumentValidator: Validator = new Validator([
  {
    location: FieldLocation.query,
    name: 'offset',
    defaultValue: 0,
    type: FieldType.number,
    validator: (val) => val >= 0,
  },
  {
    location: FieldLocation.query,
    name: 'order',
    defaultValue: 'asc',
    enums: ['asc', 'desc'],
    type: FieldType.string,
    validator: (val) => !(val !== 'asc' && val !== 'desc'),
  },
  {
    location: FieldLocation.query,
    name: 'limit',
    defaultValue: 0,
    type: FieldType.number,
    validator: (val) => !(typeof val !== 'number' && val < 0),
  },
]);

const postDocumentValidator: Validator = new Validator([
  {
    location: FieldLocation.body,
    type: FieldType.string,
    name: 'title',
    defaultValue: '',
    validator: (val) => {
      if (val.length > -1 && val.length <= 255) return true;
      return false;
    },
  },
  {
    location: FieldLocation.body,
    type: FieldType.string,
    name: 'author',
    defaultValue: '',
    validator: (val) => {
      if (val.length > -1 && val.length <= 100) return true;
      return false;
    },
  },
  {
    location: FieldLocation.body,
    type: FieldType.string,
    name: 'content',
    defaultValue: '',
    validator: (val) => {
      if (val.length > -1) {
        return true;
      }
      return false;
    },
  },
]);

export default {
  postDocumentValidator,
  getListDocumentValidator,
};
