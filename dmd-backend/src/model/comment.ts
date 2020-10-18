import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * Document of a comment
 * @export
 * @interface IDocumentComment
 * @extends {Document}
 */
export interface IDocumentComment extends Document {
  uuid: string;
  author: Schema.Types.ObjectId;
  content: String;
  created: Date;
  updated: Date;
  hidden: Boolean;
  vote: Number;
  reply: Schema.Types.ObjectId;
}

export const SchemaComment = new Schema({
  uuid: { type: String, default: uuidv4(), unique: true, index: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  content: String,
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  hidden: Boolean,
  vote: { type: Number, default: 0 },
  reply: { type: Schema.Types.ObjectId, ref: 'Comment' },
});

SchemaComment.pre<IDocumentComment>('save', function prevSavePost(next: mongoose.HookNextFunction) {
  this.updated = new Date();
  next();
});

export const ModelComment = mongoose.model<IDocumentComment>('Comment', SchemaComment);
