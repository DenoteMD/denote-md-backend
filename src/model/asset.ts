import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * Document of a article
 * @export
 * @interface IDocumentAsset
 * @extends {Document}
 */

export interface IDocumentAsset extends Document {
  uuid: String;
  author: Schema.Types.ObjectId;
  article: Schema.Types.ObjectId;
  s3link: String;
  type: String;
  uri: String;
  created: Date;
  updated: Date;
}

export interface IAsset {
  uuid: string;
  author: Schema.Types.ObjectId;
  article: Schema.Types.ObjectId;
  s3link: string;
  type: string;
  uri: string;
  created: Date;
  updated: Date;
}

export const SchemaAsset = new Schema({
  uuid: { type: String, unique: true, default: uuidv4, index: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  article: { type: Schema.Types.ObjectId, ref: 'Article' },
  s3link: { type: String },
  type: { type: String },
  uri: { type: String },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

SchemaAsset.pre<IDocumentAsset>('save', async function preSaveAsset() {
  this.updated = new Date();
});

export const ModelAsset = mongoose.model<IDocumentAsset>('Asset', SchemaAsset);
