import express from 'express';

// eslint-disable-next-line prefer-const
let instance: { [key: string]: any } = {};

export function GetExpressInstance(name: string = 'default'): express.Express {
  if (typeof instance[name] === 'undefined') {
    instance[name] = express();
  }
  return instance[name];
}

export default GetExpressInstance;
