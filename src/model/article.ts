import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * Document of a article
 * @export
 * @interface IDocumentArticle
 * @extends {Document}
 */
export interface IDocumentArticle extends Document {
  uuid: String;
  title: String;
  author: Schema.Types.ObjectId;
  content: String;
  tags: String[];
  created: Date;
  updated: Date;
  hidden: Boolean;
  vote: Number;
}

export interface IArticle {
  uuid: string;
  title: string;
  author: Schema.Types.ObjectId;
  content: string;
  tags: string[];
  created: Date;
  updated: Date;
  hidden?: boolean;
  comments: Schema.Types.ObjectId[];
  vote: number;
}

export const SchemaArticle = new Schema({
  uuid: { type: String, default: uuidv4(), unique: true, index: true },
  title: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  content: String,
  tags: [String],
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  hidden: Boolean,
  vote: { type: Number, default: 0 },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

SchemaArticle.pre<IDocumentArticle>('save', function prevSavePost(next: mongoose.HookNextFunction) {
  this.updated = new Date();
  next();
});

export const ModelArticle = mongoose.model<IDocumentArticle>('Article', SchemaArticle);
