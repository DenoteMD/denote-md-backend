import express from 'express';

export interface IPostProcessMethod {
  (v: any): any;
}

export interface IValidateMethod {
  (v: any): boolean;
}

export interface IField {
  location: 'body' | 'query' | 'params' | 'any';
  name: string;
  require?: boolean;
  type: 'string' | 'number' | 'array' | 'boolean' | 'object';
  enums?: any[];
  validator?: IValidateMethod;
  message?: string;
  defaultValue?: any;
  postProcess?: IPostProcessMethod;
}

export interface IKeyValue {
  [key: string]: any;
}

export interface IValidatedData {
  query: IKeyValue;
  body: IKeyValue;
  params: IKeyValue;
}

export class Validator {
  private fields: IField[];

  constructor(...fields: IField[]) {
    this.fields = fields;
  }

  public getFields(): IField[] {
    return this.fields;
  }

  public concat(...fields: IField[]): Validator {
    const cachedFields = [...this.fields, ...fields];
    return new Validator(...cachedFields);
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
    return typeof val === 'string' ? JSON.parse(val) : val;
  }

  private static boolean(val: any): boolean {
    return val === 'true' || val === true;
  }

  public validateRequest(req: express.Request): IValidatedData {
    return {
      body: this.validateObject(req.body || {}, 'body'),
      query: this.validateObject(req.query || {}, 'query'),
      params: this.validateObject(req.params || {}, 'params'),
    };
  }

  public validate(object: any) {
    return this.validateObject(object);
  }

  private validateObject(object: any, location: 'body' | 'query' | 'params' | 'any' = 'any'): IKeyValue {
    const result: IKeyValue = {};
    let fields: IField[] = [];
    if (['body', 'query', 'params'].includes(location)) {
      fields = this.fields.filter((e) => e.location === location);
    } else {
      fields = this.fields;
    }
    for (let i = 0; i < fields.length; i += 1) {
      const { name, require, type, validator, message, enums, defaultValue, postProcess } = fields[i];
      if (typeof object[name] !== 'undefined') {
        // Basic parse value
        const value = Validator[type](object[name]);
        // Check value with defined validator
        if (typeof validator === 'function' && !validator(value)) {
          throw new Error(`Field ${name} : ${message || 'does not satisfy validator'}`);
        }
        // Check value is in enums
        if (enums && Array.isArray(enums) && enums.includes(value)) {
          throw new RangeError(`Field ${name} need to be in range ${enums}`);
        }
        // Assign value to validated result
        if (typeof postProcess === 'function') {
          result[name] = postProcess(value);
        } else {
          result[name] = value;
        }
      } else if (require && typeof defaultValue !== 'undefined') {
        // Field is required and have defaultValue
        result[name] = defaultValue;
      } else if (require && typeof defaultValue === 'undefined') {
        // Field is required but don't have value or defaultValue
        throw new Error(`Field ${name} is required`);
      }
    }
    return result;
  }
}
