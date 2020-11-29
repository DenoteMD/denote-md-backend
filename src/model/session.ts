import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * @exports
 * @interface IDocumentSession
 * @extends {Document}
 */
export interface IDocumentSession extends Document {
  uuid: String;
  userId: Schema.Types.ObjectId;
  deviceId: Schema.Types.ObjectId;
  challengeKey: String;
  sessionKeyId: String;
  created: Date;
  expiredDate: Date;
}

export interface ISession {
  uuid: string;
  userId: Schema.Types.ObjectId;
  deviceId: Schema.Types.ObjectId;
  challengeKey: string;
  sessionKeyId: string;
  created: Date;
  expiredDate: Date;
}

export const SchemaDevice = new Schema({
  uuid: { type: String, default: uuidv4(), unique: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  deviceId: { type: Schema.Types.ObjectId, ref: 'Device' },
  challengeKey: { type: String, unique: true },
  sessionKeyId: { type: String },
  created: { type: Date, default: Date.now },
  expiredDate: Date,
});

export const ModelSession = mongoose.model<IDocumentSession>('Session', SchemaDevice);
