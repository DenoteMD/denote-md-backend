import express from 'express';
import { Mux, IRequestData, IResponseRecord } from '../framework';
import { ValidatorArticle, ArticleUuidValidator } from '../validators';
import { ModelArticle, IArticle } from '../model/article';
import { ModelUser } from '../model/user';

Mux.post<IArticle>(
  '/v1/article',
  ValidatorArticle,
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
    const savedArticle = await ModelArticle.findById(result._id).populate('author', '-_id -profile');
    if (savedArticle) {
      const responseArticle = <IArticle>savedArticle.toObject();
      return {
        success: true,
        result: {
          ...responseArticle,
        },
      };
    }
    throw new Error('We are not able to save article');
  },
);

Mux.get<IArticle>(
  '/v1/article/:articleUuid',
  ArticleUuidValidator,
  async (requestData: IRequestData): Promise<IResponseRecord<IArticle>> => {
    const { articleUuid } = requestData.params;
    const foundArticle = await ModelArticle.findOne({ articleUuid }).populate('author', '-_id -profile');
    if (foundArticle) {
      const responseArticle = <IArticle>foundArticle.toObject();
      return {
        success: true,
        result: {
          ...responseArticle,
        },
      };
    }
    throw new Error('Article not found');
  },
);

// @todo: missing get list of articles
