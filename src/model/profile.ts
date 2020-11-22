import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * @exports
 * @interface IDocumentProfile
 * @extends {Document}
 */
export interface IDocumentProfile extends Document {
  uuid: String;
  firstName: String;
  lastName: String;
  extraData: Array<Object>;
}

export const SchemaProfile = new Schema({
  uuid: { type: String, default: uuidv4(), unique: true, index: true },
  firstName: String,
  lastName: String,
  extraData: [Object],
});

export const ModelProfile = mongoose.model<IDocumentProfile>('Profile', SchemaProfile);
