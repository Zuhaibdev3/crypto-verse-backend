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
  walletAddress: string = ''
  fullName: string = '';
  bio: string = '';
  websiteLink: string = '';
  twitterUserName: string = '';
  discordUserName: string = '';
  instagramUserName: string = '';
  email: string | null = null;
  password: string | null = null;
  otp: number | null = null;
  otpExpiry: Date | null = null;
  profilePicUrl: string = '';
  role: Role;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  isDeleted: boolean = false
}

export default interface IUser {
  _id: Schema.Types.ObjectId,
  walletAddress: string
  fullName: string
  bio: string
  websiteLink?: string
  twitterUserName?: string
  discordUserName?: string
  instagramUserName?: string
  email: string | null;
  password: string | null;
  otp: number | null;
  otpExpiry: Date | null;
  profilePicUrl: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean
}


const schema = new Schema<IUser>(
  {
    walletAddress: {
      type: Schema.Types.String,
      required: false,
      unique: true
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
      unique: true
    },
    password: {
      type: Schema.Types.String,
      required: false,
      select: false,
    },
    otp: {
      type: Number,
      required: false,
    },
    otpExpiry: {
      type: Date,
      required: false,
    },
    profilePicUrl: {
      type: Schema.Types.String,
      required: false,
      trim: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: RolesDocumentName,
      required: true,
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