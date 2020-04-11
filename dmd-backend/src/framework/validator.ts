import express from 'express';

export enum FieldLocation {
    query = 'query',
    body = 'body',
    params = 'params'
}

export enum FieldType {
    string = 'string',
    number = 'number',
    object = 'object',
    array = 'array',
    boolean = 'boolean'
}

export interface Field {
    location: FieldLocation
    name: string,
    require?: boolean,
    type: FieldType,
    enums?: any[],
    validator: (val: any) => boolean,
    message?: string,
    defaultValue: any
}

export interface ValidatedData {
    query: any
    body: any
    params: any
}

export class Validator {
    private fields: Field[];

    constructor(fields: Field[]) {
      this.fields = fields;
    }

    private static string(val: any): string {
      return val.toString();
    }

    private static number(val: any): number {
      return Number.parseInt(val, 10);
    }

    private static object(val: any): any {
      return JSON.parse(val);
    }

    private static array(val: any): any[] {
      return JSON.parse(val);
    }

    private static boolean(val: any): boolean {
      return val === 'true' || val === true;
    }

    public validate(req: express.Request): ValidatedData {
      const result: ValidatedData = {
        query: {},
        body: {},
        params: {},
      };
      for (let i = 0; i < this.fields.length; i += 1) {
        const {
          location,
          name,
          require,
          type,
          validator,
          message,
          enums,
          defaultValue,
        } = this.fields[i];
        if (typeof req[location][name] !== 'undefined') {
          // Basic parse value
          const value = Validator[type](req[location][name]);
          // Check value with defined validator
          if (typeof validator === 'function' && !validator(value)) {
            throw new Error(`Field ${name} in ${location}: ${(message) || 'does not satisfy validator'}`);
          }
          // Check value is in enums
          if (enums && Array.isArray(enums) && enums.includes(value) < 0) {
            throw new RangeError(`Field ${name} need to be in range ${enums}`);
          }
          // Assign value to validated result
          result[location][name] = value;
        } else if (require && defaultValue) {
          // Field is required and have defaultValue
          result[location][name] = defaultValue;
        } else if (require && !defaultValue) {
          // Field is required but don't have value or defaultValue
          throw new Error(`Field ${name} is required in ${location}`);
        }
      }
      return result;
    }
}
