import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * @exports
 * @interface IDocumentSession
 * @extends {Document}
 */
export interface IDocumentAsset extends Document {
  uuid: String;
  articleId: Schema.Types.ObjectId;
  s3link: String;
  type: String;
  uri: String;
  created: Date;
  updated: Date;
}

export interface IAsset {
  uuid: String;
  articleId: Schema.Types.ObjectId;
  s3link: String;
  type: String;
  uri: String;
  created: Date;
}

export const SchemaAsset = new Schema({
  uuid: { type: String, default: uuidv4, unique: true, index: true },
  articleId: { type: Schema.Types.ObjectId, ref: 'Article' },
  s3link: { type: String },
  type: { type: String },
  uri: { type: String },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

export const ModelAsset = mongoose.model<IDocumentAsset>('Asset', SchemaAsset);
