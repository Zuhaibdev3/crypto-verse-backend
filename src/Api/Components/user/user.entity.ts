import { model, Schema, } from 'mongoose';
import Role, { DOCUMENT_NAME as RolesDocumentName } from '../../../database/model/Role';
import { ObjectId } from '../../../../constants';

export const USER_DOCUMENT_NAME = 'User';
export const USER_COLLECTION_NAME = 'users';

export enum USER_TYPE {
  USER = "USER",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export class User implements IUser {
  _id: Schema.Types.ObjectId = new ObjectId('');
  walletAddress: string
  fullName?: string | undefined = '';
  bio?: string | undefined = '';
  websiteLink?: string | undefined = '';
  twitterUserName?: string | undefined = '';
  discordUserName?: string | undefined = '';
  instagramUserName?: string | undefined = '';
  email?: string | undefined = '';
  profilePicUrl?: string | undefined = '';
  role?: Role | undefined;
  roleId?: Schema.Types.ObjectId | null = new ObjectId('');
  createdAt: Date = new Date();
  updatedAt?: Date | undefined = new Date();
  type: USER_TYPE.SUPER_ADMIN | USER_TYPE.USER = USER_TYPE.USER
  createdBy?: Schema.Types.ObjectId | undefined = new ObjectId('');
  isDeleted?: boolean = false
}

export default interface IUser {
  _id: Schema.Types.ObjectId,
  walletAddress: string
  fullName?: string
  bio?: string
  websiteLink?: string
  twitterUserName?: string
  discordUserName?: string
  instagramUserName?: string
  email?: string;
  profilePicUrl?: string;
  role?: Role;
  roleId?: Schema.Types.ObjectId | null;
  createdAt: Date;
  updatedAt?: Date;
  type: USER_TYPE.SUPER_ADMIN | USER_TYPE.USER
  createdBy?: Schema.Types.ObjectId | undefined,
  isDeleted?: boolean
}


const schema = new Schema<IUser>(
  {
    walletAddress: {
      type: Schema.Types.String,
      required: true,
    },
    fullName: {
      type: Schema.Types.String,
      required: false,
    },
    bio: {
      type: Schema.Types.String,
      required: false,
    },
    websiteLink: {
      type: Schema.Types.String,
      required: false,
    },
    twitterUserName: {
      type: Schema.Types.String,
      required: false,
    },
    discordUserName: {
      type: Schema.Types.String,
      required: false,
    },
    instagramUserName: {
      type: Schema.Types.String,
      required: false,
    },
    email: {
      type: Schema.Types.String,
      required: false,
      unique: true,
      trim: true,
    },

    profilePicUrl: {
      type: Schema.Types.String,
      required: false,
      trim: true,
    },

    role: {
      type: Schema.Types.ObjectId,
      ref: RolesDocumentName,
      required: false,
    },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: RolesDocumentName,
      required: false,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      required: false
    },

    type: {
      type: Schema.Types.String,
      required: true,
      // enum: [USER_TYPE.ADMIN, USER_TYPE.USER]
    },

    createdAt: {
      type: Date,
      required: false,
      select: false,
    },
    updatedAt: {
      type: Date,
      required: false,
      select: false,
    },
    isDeleted: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true
  },
);

export const UserModel = model<IUser>(USER_DOCUMENT_NAME, schema, USER_COLLECTION_NAME);