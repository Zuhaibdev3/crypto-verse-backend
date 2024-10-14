import mongoose, { model, Schema, Document } from 'mongoose';
import { ObjectId } from '../../../../constants';
import { USER_COLLECTION_NAME, User } from '../user/user.entity';

export const FILES_DOCUMENT_NAME = 'Files';
export const FILES_COLLECTION_NAME = 'files';

export default class Files implements IFiles {
  name: string = ""; // Only the "name" field is included
  userId: Schema.Types.ObjectId | null = new ObjectId(" ")

  path: string = '';
  fileName: string = '';
  fileSize: string = '';
  fileType: string = '';
}

export interface IFiles {
  name: string
  path: string,
  userId: Schema.Types.ObjectId | null
  fileName: string,
  fileSize: string,
  fileType: string,
}

const schema = new Schema<IFiles>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    path: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    fileName: {
      type: Schema.Types.String,
      required: true
    },
    fileSize: {
      type: Schema.Types.String,
      required: true
    },
    fileType: {
      type: Schema.Types.String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);



export const FilesModal = model<IFiles>(FILES_DOCUMENT_NAME, schema, FILES_COLLECTION_NAME);