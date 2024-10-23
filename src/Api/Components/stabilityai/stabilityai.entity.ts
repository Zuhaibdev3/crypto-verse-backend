import mongoose, { model, Schema, Document } from 'mongoose';

export const DALLE_DOCUMENT_NAME = 'stabilityai';
export const DALLE_COLLECTION_NAME = 'stabilityai';


export default class Stabilityai implements IStabilityai {

}

export interface IStabilityai {

}

const schema = new Schema<IStabilityai>(
  {
 
  },
  {
    strict: false,
    versionKey: false,
    timestamps: true
  }
);



export const StabilityaiModal = model<IStabilityai>(DALLE_DOCUMENT_NAME, schema, DALLE_COLLECTION_NAME);