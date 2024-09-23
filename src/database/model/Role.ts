import { Schema, model, Document } from 'mongoose';

export const DOCUMENT_NAME = 'Role';
export const COLLECTION_NAME = 'roles';

export const enum RoleCode {
  USER = 'USER',
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  INSTRUCTOR = 'INSTRUCTOR',
}

export const enum Permissions {
  BRAND_CULTURE_STRATEGY = 'BRAND_CULTURE_STRATEGY',
  CREATE_SURVEYS = 'CREATE_SURVEYS',
  CREATE_COURSES = 'CREATE_COURSES',
  CREATE_REWARDS_PROGRAM = 'CREATE_REWARDS_PROGRAM',
  CREATE_RESOURCE_GROUP = "CREATE_RESOURCE_GROUP",
  CREATE_CAMPAIGN = "CREATE_CAMPAIGN",
  CREATE_WORKSPACE = "CREATE_WORKSPACE",
  CREATE_EVENTS = "CREATE_EVENTS",
  CREATE_TASKS = "CREATE_TASKS",
  BECOME_A_MENTOR = "BECOME_A_MENTOR",
  DOWNLOAD_FILES = "DOWNLOAD_FILES",
  UPLOAD_FILES = "UPLOAD_FILES",
  MANAGE_BRAND_ASSETS = "MANAGE_BRAND_ASSETS",
  MANAGE_AGENDA = "MANAGE_AGENDA",
  ANNOTATE_FILES = "ANNOTATE_FILES",
  COMMENT = "COMMENT",
  CREATE_POLLS = "CREATE_POLLS",
  VOTE_IN_POLLS = "VOTE_IN_POLLS",
  USE_PEN_ERASE = "USE_PEN/ERASE",
  SHARE_FOR_REVIEW = "SHARE_FOR_REVIEW",
  REVIEW = "REVIEW",
  CREATE_FOLDERS = "CREATE_FOLDERS"
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
      enum: [RoleCode.USER, RoleCode.ADMIN, RoleCode.SUPER_ADMIN, RoleCode.INSTRUCTOR],
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
