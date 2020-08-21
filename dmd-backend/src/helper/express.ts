import express from 'express';

// eslint-disable-next-line prefer-const
let instance: { [key: string]: any } = {};

export class Singleton {
  public static getExpressInstance(): express.Express {
    if (typeof instance.express === 'undefined') {
      instance.express = express();
    }
    return instance.express;
  }
}

export default Singleton;
