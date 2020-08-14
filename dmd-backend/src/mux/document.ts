import { Mux, RequestData } from '../framework/mux';
import { DocumentPost, ModelPost } from '../model/post';
import { ResponseRecord } from '../framework/response';
import logger from '../helper/logger';

Mux.post(
  '/',
  undefined,
  // eslint-disable-next-line no-unused-vars
  async (reqData: RequestData): Promise<ResponseRecord> => {
    const { body: requestBody } = reqData;
    const {
      title,
      author,
      content,
      tags,
    }: DocumentPost = requestBody;
    logger.debug('Handling POST document');
    const documentModel = new ModelPost({
      title,
      author,
      content,
      tags,
      hidden: false,
      votes: 0,
      replyTo: 0,
    });
    const result = await documentModel.save();
    logger.debug('Successfully added a document');
    return {
      success: true,
      result,
    };
  },
);
