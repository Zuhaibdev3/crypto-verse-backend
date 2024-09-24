import { Schema, model, Document } from 'mongoose';

export const DOCUMENT_NAME = 'Role';
export const COLLECTION_NAME = 'roles';

export const enum RoleCode {
  USER = 'USER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export default interface Role extends Document {
  code: RoleCode;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    code: {
      type: Schema.Types.String,
      required: true,
      // unique: true,
      enum: [RoleCode.USER, RoleCode.SUPER_ADMIN, ],
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      required: true,
      select: false,
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

export const RoleModel = model<Role>(DOCUMENT_NAME, schema, COLLECTION_NAME);
