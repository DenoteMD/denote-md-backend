import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * @exports
 * @interface IDocumentDevice
 * @extends {Document}
 */
export interface IDocumentDevice extends Document {
  uuid: String;
  deviceName: String;
  ipAddress: String;
  lastActive: Date;
}

export interface IDevice {
  uuid: string;
  deviceName: string;
  ipAddress: string;
  lastActive: Date;
}

export const SchemaDevice = new Schema({
  uuid: { type: String, default: uuidv4, unique: true, index: true },
  deviceName: String,
  ipAddress: String,
  lastActive: Date,
});

export const ModelProfile = mongoose.model<IDocumentDevice>('Device', SchemaDevice);
