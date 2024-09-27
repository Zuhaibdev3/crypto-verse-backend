import mongoose, { model, Schema, Document } from 'mongoose';

export const DALLE_DOCUMENT_NAME = 'dalle';
export const DALLE_COLLECTION_NAME = 'Dalle';

export default class Dalle implements IDalle {}

export interface IDalle  {}

const schema = new Schema<IDalle>(
  {},
  {
    strict: false,
    versionKey: false,
    timestamps: true
  }
);



export const DalleModal = model<IDalle>(DALLE_DOCUMENT_NAME, schema, DALLE_COLLECTION_NAME);