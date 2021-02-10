import { Mux, IMuxRequest, IRequestData, IResponseRecord, Validator } from '../framework';

Mux.post<any>(
  '/v1/echo',
  new Validator(),
  async (requestData: IRequestData, req?: IMuxRequest): Promise<IResponseRecord<any>> => {
    return {
      success: true,
      result: {
        ...requestData,
        session: req?.session?.getSession(),
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
        session: req?.session?.getSession(),
      },
    };
  },
);
