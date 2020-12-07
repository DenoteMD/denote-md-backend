import Mux, { IMuxRequest, IRequestData } from '../framework/mux';
import { IResponseRecord } from '../framework/response';
import { Validator } from '../framework/validator';

Mux.post<any>(
  '/v1/echo',
  new Validator(),
  async (requestData: IRequestData, req?: IMuxRequest): Promise<IResponseRecord<any>> => {
    return {
      success: true,
      result: {
        ...requestData,
        session: req?.session,
      },
    };
  },
);

Mux.get<any>(
  '/v1/echo',
  new Validator(),
  async (requestData: IRequestData, req?: IMuxRequest): Promise<IResponseRecord<any>> => {
    return {
      success: true,
      result: {
        ...requestData,
        session: req?.session,
      },
    };
  },
);
