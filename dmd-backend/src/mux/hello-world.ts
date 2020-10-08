import Mux, { RequestData } from '../framework/mux';
import { ResponseRecord } from '../framework/response';
import { Validator } from '../framework/validator';

Mux.get('/hello-world', new Validator(), async (requestData: RequestData) => {
  return <ResponseRecord>{
    success: true,
    result: {
      value: 'Hello world!!',
      data: requestData,
    },
  };
});
