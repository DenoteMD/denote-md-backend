import Mux, { IRequestData } from '../framework/mux';
import { IResponseList, IOrdering } from '../framework/response';
import { ModelArticle } from '../model/article';
import { IComment, ModelComment } from '../model/comment';
import { ArticleUuidValidator, CommentUuidValidator } from '../validators';

// Get all comments at root level in article for a given article's UUID
Mux.get<IComment>(
  '/v1/comment/article/:articleUuid',
  ArticleUuidValidator,
  async (requestData: IRequestData): Promise<IResponseList<IComment>> => {
    const offset = requestData.body.offset > 1 ? requestData.body.offset - 1 : 0;
    const limit = requestData.body.limit ? requestData.body.limit : 10;
    const order = requestData.body.order
      ? requestData.body.order
      : [
          { column: 'updated', order: 'desc' },
          { column: 'created', order: 'desc' },
        ];
    const { articleUuid } = requestData.params;
    const foundArticle = await ModelArticle.findOne({ uuid: articleUuid });

    if (foundArticle) {
      const orderObject = order.reduce((curObj: IOrdering, item: IOrdering) => {
        return {
          ...curObj,
          [item.column]: item.order,
        };
      }, {});

      const foundComments = (await ModelComment.find({ article: foundArticle._id, reply: undefined, hidden: false })
        .sort(orderObject)
        .skip(offset * limit)
        .limit(limit)
        .lean()) as [IComment];

      return {
        success: true,
        result: {
          limit,
          offset,
          records: foundComments,
          order,
          total: foundComments.length,
        },
      };
    }
    throw new Error("Can't find comment for this article");
  },
);

// Get all comments that's reply to a given comment UUID
Mux.get<IComment>(
  '/v1/comment/comment/:commentUuid',
  CommentUuidValidator,
  async (requestData: IRequestData): Promise<IResponseList<IComment>> => {
    const { commentUuid } = requestData.params;
    const offset = requestData.body.offset > 1 ? requestData.body.offset - 1 : 0;
    const limit = requestData.body.limit ? requestData.body.limit : 10;
    const order = requestData.body.order
      ? requestData.body.order
      : [
          { column: 'updated', order: 'desc' },
          { column: 'created', order: 'desc' },
        ];

    const foundComment = await ModelComment.findOne({ uuid: commentUuid });
    if (foundComment) {
      const orderObject = order.reduce((curObj: IOrdering, item: IOrdering) => {
        return {
          ...curObj,
          [item.column]: item.order,
        };
      }, {});
      const replyComments = (await ModelComment.find({ reply: foundComment._id })
        .sort(orderObject)
        .skip(offset * limit)
        .limit(limit)
        .lean()) as [IComment];

      return {
        success: true,
        result: {
          limit,
          offset,
          records: replyComments,
          order,
          total: replyComments.length,
        },
      };
    }
    throw new Error("Can't find comment for this article");
  },
);
