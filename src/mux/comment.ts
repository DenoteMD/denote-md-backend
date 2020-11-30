import express from 'express';
import Mux, { IRequestData } from '../framework/mux';
import { IResponseList, IResponseRecord } from '../framework/response';
import { ModelArticle } from '../model/article';
import { IComment, ModelComment } from '../model/comment';
import { ModelUser } from '../model/user';
import { CommentValidator, UuidValidator } from '../validators';

// Get all comments at root level in article for a given article's UUID
Mux.get<[IComment]>(
  '/v1/comment/article/:articleUuid',
  UuidValidator,
  async (requestData: IRequestData): Promise<IResponseList<[IComment]>> => {
    const offset = requestData.body.offset > 1 ? requestData.body.offset - 1 : 0;
    const limit = requestData.body.limit ? requestData.body.limit : 10;
    const order = requestData.body.order ? requestData.body.order : [{ column: 'updated', order: 'asc' }];
    // Get all comments with reply = undefined --> root comment
    const foundComments = (await ModelComment.find({ uuid: requestData.params.uuid, reply: undefined })
      .sort({ ...order })
      .limit(limit)
      .skip(offset * limit)
      .lean()) as [IComment];
    // Count total root comments in this article
    const totalComments = await ModelComment.find({ uuid: requestData.params.uuid, reply: undefined }).countDocuments();
    return {
      success: true,
      result: {
        total: totalComments,
        limit,
        offset,
        order,
        records: [foundComments],
      },
    };
  },
);

// Get all comments that's reply to a given comment UUID
Mux.get<[IComment]>(
  '/v1/comment/comment/:commentUuid',
  UuidValidator,
  async (requestData: IRequestData): Promise<IResponseList<[IComment]>> => {
    const offset = requestData.body.offset > 1 ? requestData.body.offset - 1 : 0;
    const limit = requestData.body.limit ? requestData.body.limit : 10;
    const order = requestData.body.order ? requestData.body.order : [{ column: 'updated', order: 'asc' }];

    const rootComment = await ModelComment.findOne({ uuid: requestData.params.commentUuid });

    if (rootComment) {
      const foundComments = (await ModelComment.find({ reply: rootComment._id })
        .sort({ ...order })
        .limit(limit)
        .skip(offset * limit)
        .lean()) as [IComment];

      return {
        success: true,
        result: {
          total: foundComments.length,
          limit,
          offset,
          order,
          records: [foundComments],
        },
      };
    }
    // Found no reply
    return {
      success: true,
      result: {
        total: 0,
        limit,
        offset,
        order,
        records: [],
      },
    };
  },
);

// Add a comment at root level in an article base on article's uuid
Mux.post<IComment>(
  '/v1/comment/article/:articleUuid',
  CommentValidator,
  async (requestData: IRequestData, req?: express.Request): Promise<IResponseRecord<IComment>> => {
    const { articleUuid } = requestData.params;
    const imComment = new ModelComment(requestData.body);
    // If req is defined
    if (req) {
      // Get userId from header
      const userId = req.header('X-Denote-User-Identity');
      // Find is user existing
      const user = await ModelUser.findOne({ userId });
      if (user) {
        imComment.author = user._id;
      } else {
        const imUser = new ModelUser({
          userId,
        });
        const savedUser = await imUser.save();
        imComment.author = savedUser._id;
      }
    }

    const article = await ModelArticle.findOne({ uuid: articleUuid });
    if (article) {
      imComment.articleId = article._id;
      const result = await imComment.save();
      const savedComment = await ModelComment.findById(result._id).populate(['author', 'articleId']);
      if (savedComment) {
        const { uuid, author, reply, votedUser, content, created, updated, hidden, vote } = savedComment.toObject({
          transform: (_doc: any, ret: any) => {
            const keys = Object.keys(ret);
            for (let i = 0; i < keys.length; i += 1) {
              const key = keys[i];
              if (key.indexOf('_') === 0) {
                // eslint-disable-next-line no-param-reassign
                delete ret[key];
              }
            }
          },
        });
        return {
          success: true,
          result: {
            uuid,
            author,
            reply,
            votedUser,
            content,
            created,
            updated,
            hidden,
            vote,
          },
        };
      }
    }
    throw new Error('We are not able to save comment');
  },
);

// Reply to a comment in an article base on article's uuid
Mux.post<IComment>(
  '/v1/comment/:commentUuid/article/:articleUuid',
  CommentValidator,
  async (requestData: IRequestData, req?: express.Request): Promise<IResponseRecord<IComment>> => {
    const { commentUuid, articleUuid } = requestData.params;
    const replyComment = new ModelComment(requestData.body);

    if (req) {
      // Get userId from header
      const userId = req.header('X-Denote-User-Identity');
      // Find article and comment in db base on articleUuid and commentUuid
      const article = await ModelArticle.findOne({ uuid: articleUuid });
      const comment = await ModelComment.findOne({ uuid: commentUuid });
      // Find is user existing
      const user = await ModelUser.findOne({ userId });
      if (user) {
        replyComment.author = user._id;
      } else {
        const imUser = new ModelUser({
          userId,
        });
        const savedUser = await imUser.save();
        replyComment.author = savedUser._id;
      }
      if (comment && article) {
        replyComment.reply = comment._id;
        replyComment.articleId = article._id;
      }
      const result = await replyComment.save();

      const savedReply = await ModelComment.findById(result._id);
      if (savedReply) {
        const { uuid, author, reply, votedUser, content, created, updated, hidden, vote } = savedReply.toObject({
          transform: (_doc: any, ret: any) => {
            const keys = Object.keys(ret);
            for (let i = 0; i < keys.length; i += 1) {
              const key = keys[i];
              if (key.indexOf('_') === 0) {
                // eslint-disable-next-line no-param-reassign
                delete ret[key];
              }
            }
          },
        });
        return {
          success: true,
          result: {
            uuid,
            author,
            reply,
            votedUser,
            content,
            created,
            updated,
            hidden,
            vote,
          },
        };
      }
    }
    throw new Error('We are not able to save comment');
  },
);

// Edit comment in article
Mux.put<IComment>('/v1/comment/:commentUuid', CommentValidator, async (): Promise<any> => {});

// Delete a comment
Mux.delete<IComment>('/v1/comment/:commentUuid', UuidValidator, async (): Promise<any> => {});
