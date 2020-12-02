import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IDocumentAsset extends Document {
  uuid: String,
  articleId: Schema.Types.ObjectId,
  s3link: String,
  type: String,
  uri: String,
  created: Date,
  updated: Date,
}

export interface IAsset {
  uuid: string,
  articleId: Schema.Types.ObjectId,
  s3link: string,
  type: string,
  uri: string,
  created: Date,
  updated: Date,
}

export const SchemaAsset = new Schema({
  uuid: { type: String, default: uuidv4(), unique: true, index: true },
  articleId: { type: Schema.Types.ObjectId, ref: 'Article' },
  s3link: String,
  type: String,
  uri: String,
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

SchemaAsset.pre<IDocumentAsset>('save', function prevSavePost(next: mongoose.HookNextFunction) {
  this.updated = new Date();
  next();
})

export const ModelAsset = mongoose.model<IDocumentAsset>('Asset', SchemaAsset);
