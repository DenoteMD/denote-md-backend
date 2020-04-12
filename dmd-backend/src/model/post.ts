import mongoose, { Schema, Document } from 'mongoose';

/**
 * Document of a post
 * @export
 * @interface DocumentPost
 * @extends {Document}
 */
export interface DocumentPost extends Document {
    title: String,
    author: String,
    body: String,
    tags: String[],
    comments: {
        id: Number,
        body: String,
        date: Date,
        replyTo: Number
    }[],
    created: Date
    updated: Date
    hidden: Boolean,
    votes: Number,
    favs: Number
}

export const SchemaPost = new Schema({
  title: String,
  author: String,
  body: String,
  tags: [String],
  comments: [{
    id: Number,
    body: String,
    date: Date,
    replyTo: Number,
  }],
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  hidden: Boolean,
  votes: Number,
  favs: Number,
});

SchemaPost.pre<DocumentPost>('save', function prevSavePost(next) {
  this.updated = new Date();
  next();
});

export const ModelPost = mongoose.model<DocumentPost>('Post', SchemaPost);
