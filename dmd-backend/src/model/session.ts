import mongoose, { Schema, Document } from 'mongoose';

/**
 * Document of a session
 * @export
 * @interface DocumentSession
 * @extends {Document}
 */
export interface DocumentSession extends Document {
    sessionId: String,
    tempKey: Buffer,
    user: Schema.Types.ObjectId,
    created: Date,
}

export const SchemaPost = new Schema({
  sessionId: { type: String, index: true },
  tempKey: Schema.Types.Buffer,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  created: { type: Date, default: Date.now },
});

export const ModelSession = mongoose.model<DocumentSession>('User', SchemaPost);
