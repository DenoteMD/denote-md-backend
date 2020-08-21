import mongoose, { Schema, Document } from 'mongoose';

/**
 * Document of a post
 * @export
 * @interface DocumentPost
 * @extends {Document}
 */
export interface DocumentPost extends Document {
    title: String,
    author: Schema.Types.ObjectId,
    body: String,
    tags: String[],
    created: Date
    updated: Date
    hidden: Boolean,
    vote: Number,
    devote: Number,
    favs: Number
}

export const SchemaPost = new Schema({
  title: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  body: String,
  tags: [String],
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  hidden: Boolean,
  vote: Number,
  devote: Number,
});

SchemaPost.pre<DocumentPost>('save', function prevSavePost(next) {
  this.updated = new Date();
  next();
});

export const ModelPost = mongoose.model<DocumentPost>('Post', SchemaPost);
