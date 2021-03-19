import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * Document of a user
 * @export
 * @interface DocumentUser
 * @extends {Document}
 */
export interface IDocumentUser extends Document {
  uuid: String;
  profileId: Schema.Types.ObjectId;
  deviceId: Schema.Types.ObjectId[];
  alias: String;
  email: String;
  status: String;
  created: Date;
  updated: Date;
  active: Boolean;
  lastActive: Date;
}

export interface IUser {
  uuid: string;
  profileId: Schema.Types.ObjectId;
  deviceId: Schema.Types.ObjectId[];
  alias: string;
  status: string;
  created: Date;
  active: boolean;
  achievement: [String];
  email: string;
}

export const SchemaUser = new Schema({
  profileId: { type: Schema.Types.ObjectId, ref: 'Profile' },
  deviceId: [{ type: Schema.Types.ObjectId, ref: 'Device' }],
  uuid: { type: String, default: uuidv4, unique: true, index: true },
  alias: { type: String, unique: true, index: true },
  status: String,
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  lastActive: { type: Date, default: Date.now },
  achievement: [String],
  email: { type: String, unique: true, index: true },
});

export const ModelUser = mongoose.model<IDocumentUser>('User', SchemaUser);
