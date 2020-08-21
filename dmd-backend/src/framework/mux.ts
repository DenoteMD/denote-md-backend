import express from 'express';
import { Validator } from './validator';
import {
  ResponseError,
  ResponseList,
  ResponseRecord,
} from './response';
import Singleton from '../helper/express';

export interface RequestData {
  body: any;
  query: any;
  params: any;
}

export interface MuxHandler {
  (requestData: RequestData, req?: express.Request): Promise<ResponseRecord| ResponseError| ResponseList>
}

export class Mux {
  private static expressApp: any = Singleton.getExpressInstance();

  private static muxMap: any[] = [];

  private static production :boolean = true;

  public static get(url:string, validator: Validator|undefined, handler:MuxHandler) {
    Mux.muxMap.push({
      method: 'get',
      url,
      validator,
      handler,
    });
  }

  public static post(url:string, validator: Validator|undefined, handler:MuxHandler) {
    Mux.muxMap.push({
      method: 'post',
      url,
      validator,
      handler,
    });
  }

  public static put(url:string, validator: Validator|undefined, handler:MuxHandler) {
    Mux.muxMap.push({
      method: 'put',
      url,
      validator,
      handler,
    });
  }

  public static delete(url:string, validator: Validator|undefined, handler:MuxHandler) {
    Mux.muxMap.push({
      method: 'delete',
      url,
      validator,
      handler,
    });
  }

  public static patch(url:string, validator: Validator|undefined, handler:MuxHandler) {
    Mux.muxMap.push({
      method: 'patch',
      url,
      validator,
      handler,
    });
  }

  private static addHandler(
    methodName : string,
    url:string,
    validator: Validator|undefined,
    handler: MuxHandler,
  ) {
    Mux.expressApp[methodName](url, async (req: express.Request, res :express.Response) => {
      let responseResult = null;
      try {
        let verifiedRequestData;
        if (validator instanceof Validator) {
          verifiedRequestData = validator.validate(req);
        } else {
          verifiedRequestData = {
            body: {},
            params: {},
            query: {},
          };
        }
        const result = await handler(verifiedRequestData, req);
        responseResult = res.status(200).send(result);
      } catch (raisedError) {
        if (raisedError instanceof Error) {
          responseResult = res.status(500).send({
            success: false,
            result: {
              message: raisedError.message,
              stack: Mux.production ? '' : raisedError.stack,
            },
          });
        } else {
          responseResult = res.status(500).send({
            success: false,
            result: {
              message: 'Unexpected error!',
              stack: '',
            },
          });
        }
      }
      return responseResult;
    });
  }

  public static init(production: boolean = true): any {
    Mux.production = production;
    Mux.expressApp.use(express.json());
    for (let i = 0; i < Mux.muxMap.length; i += 1) {
      const {
        method,
        url,
        validator,
        handler,
      } = Mux.muxMap[i];
      Mux.addHandler(method, url, validator, handler);
    }
    return Mux.expressApp;
  }
}

export default Mux;
