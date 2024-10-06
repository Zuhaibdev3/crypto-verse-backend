import mongoose, { model, Schema, Document } from 'mongoose';
import { ObjectId } from '../../../../constants';
import { USER_DOCUMENT_NAME } from '../user/user.entity';

export const FILES_DOCUMENT_NAME = 'Files';
export const FILES_COLLECTION_NAME = 'files';

export default class Files implements IFiles {
  name: string = ""; // Only the "name" field is included
  userId: Schema.Types.ObjectId | null = new ObjectId(" ")
  path: string = '';
  fileName: string = '';
  fileSize: string = '';
  fileType: string = '';
  createdBy: Schema.Types.ObjectId | undefined = new ObjectId('');
  isDeleted: boolean = false
}

export interface IFiles {
  name: string
  path: string,
  userId: Schema.Types.ObjectId | null
  fileName: string,
  fileSize: string,
  fileType: string,
  createdBy: Schema.Types.ObjectId | undefined,
  isDeleted: boolean
}

const schema = new Schema<IFiles>(
  {
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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: USER_DOCUMENT_NAME,
      // required: true,
    },
    isDeleted: {
      type: Schema.Types.Boolean,
      default: false
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);



export const FilesModal = model<IFiles>(FILES_DOCUMENT_NAME, schema, FILES_COLLECTION_NAME);