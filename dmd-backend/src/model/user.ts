import mongoose, { Schema, Document } from 'mongoose';

/**
 * Document of a user
 * @export
 * @interface DocumentUser
 * @extends {Document}
 */
export interface DocumentUser extends Document {
    username: String,
    secretKey: Buffer,
    created: Date
    active: Boolean,
}

export const SchemaPost = new Schema({
  username: String,
  secretKey: Schema.Types.Buffer,
  created: { type: Date, default: Date.now },
  active: Boolean,
});

export const ModelUser = mongoose.model<DocumentUser>('User', SchemaPost);
