import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * Document of a user
 * @export
 * @interface DocumentUser
 * @extends {Document}
 */
export interface IDocumentUser extends Document {
  profileId: Schema.Types.ObjectId;
  deviceId: Schema.Types.ObjectId[];
  uuid: String;
  alias: String;
  status: String;
  created: Date;
  active: Boolean;
  achievement: [String];
  email: String;
}

export interface IUser {
  profileId: Schema.Types.ObjectId;
  deviceId: Schema.Types.ObjectId[];
  uuid: string;
  alias: string;
  status: string;
  created: Date;
  active: boolean;
  achievement: [String];
  email: string;
}

export const SchemaUser = new Schema({
  profileId: { type: Schema.Types.ObjectId, ref: 'Profile' },
  deviceId: { type: [Schema.Types.ObjectId], ref: 'User' },
  uuid: { type: String, default: uuidv4(), unique: true, index: true },
  alias: { type: String, unique: true, index: true },
  status: String,
  vote: { type: Number, default: 100 },
  created: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  achievement: [String],
  email: { type: String, unique: true, index: true },
});

export const ModelUser = mongoose.model<IDocumentUser>('User', SchemaUser);
