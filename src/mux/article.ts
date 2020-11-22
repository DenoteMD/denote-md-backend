import express from 'express';
import Mux, { IRequestData } from '../framework/mux';
import { IResponseRecord } from '../framework/response';
import { ArticleValidator, UuidValidator } from '../validators';
import { ModelArticle, IArticle } from '../model/article';
import { ModelUser } from '../model/user';

Mux.post<IArticle>(
  '/v1/article',
  ArticleValidator,
  async (requestData: IRequestData, req?: express.Request): Promise<IResponseRecord<IArticle>> => {
    // Create new article model based on post data
    const imArticle = new ModelArticle(requestData.body);
    // If req is defined
    if (req) {
      // Get userId from header
      const userId = req.header('X-Denote-User-Identity');
      // Find is user existing
      const user = await ModelUser.findOne({ userId });
      if (user) {
        imArticle.author = user._id;
      } else {
        const imUser = new ModelUser({
          userId,
        });
        const savedUser = await imUser.save();
        imArticle.author = savedUser._id;
      }
    }
    const result = await imArticle.save();
    const savedArticle = await ModelArticle.findById(result._id).populate('author');
    if (savedArticle) {
      const { uuid, tags, author, vote, comments, title, content, created, updated } = savedArticle.toObject({
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
          tags,
          author,
          vote,
          comments,
          title,
          content,
          created,
          updated,
        },
      };
    }
    throw new Error('We are not able to save article');
  },
);

Mux.get<IArticle>(
  '/v1/article/:uuid',
  UuidValidator,
  async (requestData: IRequestData): Promise<IResponseRecord<IArticle>> => {
    const foundArticle = await ModelArticle.findOne({ uuid: requestData.params.uuid }).populate('author');
    if (foundArticle) {
      const { uuid, tags, author, vote, comments, title, content, created, updated } = foundArticle.toObject({
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
        result: { uuid, tags, author, vote, comments, title, content, created, updated },
      };
    }
    throw new Error('Article not found');
  },
);
