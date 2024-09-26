import mongoose, { model, Schema, Document } from 'mongoose';

export const MIDJOURNEY_DOCUMENT_NAME = 'MidJourney';
export const MIDJOURNEY_COLLECTION_NAME = 'midJourney';

export default class MidJourney implements IMidJourney {}

export interface IMidJourney  {}

const schema = new Schema<IMidJourney>(
  {},
  {
    strict: false,
    versionKey: false,
    timestamps: true
  }
);



export const MidJourneyModal = model<IMidJourney>(MIDJOURNEY_DOCUMENT_NAME, schema, MIDJOURNEY_COLLECTION_NAME);