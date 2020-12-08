import Mux, { IRequestData, IMuxRequest } from '../framework/mux';
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
  async (requestData: IRequestData, req?: IMuxRequest): Promise<IResponseRecord<IComment>> => {
    const { articleUuid } = requestData.params;
    const imComment = new ModelComment(requestData.body);
    // If req is defined
    if (req && req.session) {
      // Find user from current session
      const user = await ModelUser.findById(req.session.user).exec();
      if (user) {
        imComment.author = user._id;
      }
    }

    const foundArticle = await ModelArticle.findOne({ uuid: articleUuid });
    if (foundArticle) {
      imComment.article = foundArticle._id;
      const result = await imComment.save();
      const savedComment = await ModelComment.findById(result._id).populate(['author', 'article']);
      if (savedComment) {
        const {
          uuid,
          author,
          article,
          reply,
          votedUser,
          content,
          created,
          updated,
          hidden,
          vote,
        } = savedComment.toObject();
        return {
          success: true,
          result: {
            uuid,
            author,
            article,
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
  async (requestData: IRequestData, req?: IMuxRequest): Promise<IResponseRecord<IComment>> => {
    const { commentUuid, articleUuid } = requestData.params;
    const replyComment = new ModelComment(requestData.body);

    if (req && req.session) {
      const foundArticle = await ModelArticle.findOne({ uuid: articleUuid });
      const comment = await ModelComment.findOne({ uuid: commentUuid });
      // Find user from current session
      const user = await ModelUser.findById(req.session.user);
      if (user) {
        replyComment.author = user._id;
      }
      if (comment && foundArticle) {
        replyComment.reply = comment._id;
        replyComment.article = foundArticle._id;
      }
      const result = await replyComment.save();

      const savedReply = await ModelComment.findById(result._id);
      if (savedReply) {
        const {
          uuid,
          author,
          article,
          reply,
          votedUser,
          content,
          created,
          updated,
          hidden,
          vote,
        } = savedReply.toObject();
        return {
          success: true,
          result: {
            uuid,
            author,
            article,
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
Mux.put<IComment>(
  '/v1/comment/:commentUuid',
  CommentValidator,
  async (requestData: IRequestData, req?: IMuxRequest): Promise<IResponseRecord<IComment>> => {
    const { commentUuid } = requestData.params;
    if (req && req.session) {
      // Find user from current session
      const user = await ModelUser.findById(req.session.user);
      const comment = await ModelComment.findOne({ uuid: commentUuid });
      if (comment && user) {
        if (comment.author === user._id) {
          const savedComment = await ModelComment.findOneAndUpdate(
            { uuid: commentUuid, author: user._id },
            { ...requestData.body },
          );
          if (savedComment) {
            const {
              uuid,
              author,
              article,
              reply,
              votedUser,
              content,
              created,
              updated,
              hidden,
              vote,
            } = savedComment.toObject();
            return {
              success: true,
              result: {
                uuid,
                article,
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
      }
    }
    throw new Error('We are not able to save comment');
  },
);

// Delete a comment
Mux.delete<IComment>(
  '/v1/comment/:commentUuid',
  UuidValidator,
  async (requestData: IRequestData, req?: IMuxRequest): Promise<IResponseRecord<IComment>> => {
    const { commentUuid } = requestData.params;
    if (req && req.session) {
      // Find user from current session
      const user = await ModelUser.findById(req.session.user);
      if (user) {
        const deletedComment = await ModelComment.findOneAndDelete({ uuid: commentUuid, author: user._id });
        if (deletedComment) {
          const {
            uuid,
            author,
            article,
            reply,
            votedUser,
            content,
            created,
            updated,
            hidden,
            vote,
          } = deletedComment.toObject();
          return {
            success: true,
            result: {
              uuid,
              author,
              article,
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
    }
    throw new Error('We are not able to delete comment');
  },
);
