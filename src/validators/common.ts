import { validate } from 'uuid';
import { IField, TLocation } from '../framework';

export const CreateUuidField = (name: string, location: TLocation = 'params'): IField => {
  return {
    name,
    location,
    type: 'string',
    require: true,
    validator: (v: string) => validate(v),
    message: `Invalid UUID value`,
  };
};

export default CreateUuidField;
