import { Mux, RequestData } from '../framework/mux';
// import { DocumentPost, SchemaPost } from '../model/post';
import { ResponseRecord } from '../framework/response';
import logger from '../helper/logger';

Mux.get(
  '/',
  undefined,
  // eslint-disable-next-line no-unused-vars
  async (_reqData: RequestData): Promise<ResponseRecord> => {
    logger.debug('Handling POST document');
    return {
      success: true,
      result: {},
    };
  },
);
