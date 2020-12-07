import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * Document interface of comment
 * @export
 * @interface IDocumentComment
 * @extends {Document}
 */
export interface IDocumentComment extends Document {
  uuid: String;
  author: Schema.Types.ObjectId;
  article: Schema.Types.ObjectId;
  reply: Schema.Types.ObjectId;
  votedUser: Schema.Types.ObjectId[];
  content: String;
  created: Date;
  updated: Date;
  hidden: Boolean;
  vote: Number;
}

/**
 * This interface will be represent for Comment in our code
 * @export
 * @interface IComment
 */
export interface IComment {
  uuid: string;
  author: Schema.Types.ObjectId;
  article: Schema.Types.ObjectId;
  // If reply isn't set that meant this comment, is in the root of comment section
  reply?: Schema.Types.ObjectId;
  // We need to record whom had voted
  votedUser: Schema.Types.ObjectId[];
  content: string;
  created: Date;
  updated: Date;
  hidden?: boolean;
  // This value used to cache an show vote directly instead of calculate number of vote every time
  vote: number;
}

export const SchemaComment = new Schema({
  uuid: { type: String, default: uuidv4(), unique: true, index: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  article: { type: Schema.Types.ObjectId, ref: 'Article' },
  reply: { type: Schema.Types.ObjectId, ref: 'Comment' },
  votedUser: { type: [Schema.Types.ObjectId], ref: 'User' },
  content: String,
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  hidden: Boolean,
  vote: { type: Number, default: 0 },
});

SchemaComment.pre<IDocumentComment>('save', async function prevSaveComment() {
  this.updated = new Date();
});

export const ModelComment = mongoose.model<IDocumentComment>('Comment', SchemaComment);
