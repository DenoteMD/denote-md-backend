import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * @exports
 * @interface IDocumentSession
 * @extends {Document}
 */
export interface IDocumentSession extends Document {
  uuid: String;
  user: Schema.Types.ObjectId;
  device: Schema.Types.ObjectId;
  challengeKey: String;
  sessionKeyId: String;
  data: Map<string, any>;
  created: Date;
  expiredDate: Date;
}

export interface ISession {
  uuid: string;
  user: Schema.Types.ObjectId;
  device: Schema.Types.ObjectId;
  challengeKey: string;
  sessionKeyId: string;
  data: Map<string, any>;
  created: Date;
  expiredDate: Date;
}

export const SchemaSession = new Schema({
  uuid: { type: String, default: uuidv4(), unique: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  device: { type: Schema.Types.ObjectId, ref: 'Device' },
  challengeKey: { type: String, unique: true, index: true },
  sessionKeyId: { type: String, unique: true, index: true },
  created: { type: Date, default: Date.now },
  data: Map,
  expiredDate: Date,
});

export const ModelSession = mongoose.model<IDocumentSession>('Session', SchemaSession);
