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
  description: String;
  updated: Date;
}

export const SchemaProfile = new Schema({
  uuid: { type: String, default: uuidv4(), unique: true, index: true },
  firstName: String,
  lastName: String,
  description: String,
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

SchemaProfile.pre<IDocumentProfile>('save', function preSaveProfile(next: mongoose.HookNextFunction) {
  this.updated = new Date();
  next();
});

export const ModelProfile = mongoose.model<IDocumentProfile>('Profile', SchemaProfile);
