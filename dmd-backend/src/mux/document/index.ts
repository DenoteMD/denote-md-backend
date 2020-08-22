import { Mux, RequestData } from '../../framework/mux';
import { DocumentPost, ModelPost } from '../../model/post';
import { ResponseRecord, ResponseList } from '../../framework/response';
import logger from '../../helper/logger';

import validators from './validators';

const {
  postValidator,
  getListValidator,
} = validators;

Mux.get(
  '/posts',
  getListValidator,
  async (reqData: RequestData): Promise<ResponseList> => {
    const { offset, limit, order } = reqData.query;
    const total = await ModelPost.count({});
    const listDocuments = await ModelPost
      .find()
      .sort({
        created: order,
      })
      .skip(offset)
      .limit(limit);
    return {
      success: true,
      result: {
        total,
        offset,
        limit,
        order,
        records: listDocuments,
      },
    };
  },
);

Mux.post(
  '/post',
  postValidator,
  async (reqData: RequestData): Promise<ResponseRecord> => {
    const { body: requestBody } = reqData;
    const {
      title,
      author,
      body,
    }: DocumentPost = requestBody;
    logger.debug('Handling POST document');
    const documentModel = new ModelPost({
      title,
      author,
      body,
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
