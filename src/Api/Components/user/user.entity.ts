import { model, Schema, Document } from 'mongoose';
import { BUSINESS_DOCUMENT_NAME } from '../business/business.entity';
import Role, { Permissions, DOCUMENT_NAME as RolesDocumentName } from '../../../database/model/Role';
import { ObjectId } from '../../../../constants';
import { ILocation, LocationDTO } from '../../../dto/location.dto';
import { ISocialLinks, SocialLinksDTO } from '../../../dto/social.dto';
import { BUSINESS_COLLECTION_NAME } from '../business/business.entity';
import { DEPARTMENT_DOCUMENT_NAME } from '../department/department.entity';
import { enumMapper } from '../../../utils/enumMapper';
import { Ethnicity_Codes, PersonOfColor_Enum, jobLevel_Enums } from '../../../enums/user.enum';
// import { Business_DOCUMENT_NAME } from '../business/BusinessNew/business.entity';


export const USER_DOCUMENT_NAME = 'User';
export const USER_COLLECTION_NAME = 'users';
export const INSTRUCTOR_PERMISSION = "Create Courses"

export enum USER_TYPE {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}


export class MentorshipDTO {
  isOpenToMentorship: boolean = false
  isLookingForMentorship: boolean = false
}
export class RewardDTO {
  points: number | null = 0;
  pointsToSend: number | null = 0;
  pointsToReedem: number | null = 0;
  amount: number | null = 0;
}
export class User implements IUser {
  _id: Schema.Types.ObjectId = new ObjectId('');
  id: Schema.Types.ObjectId;
  fcm_token: Array<any> = [];
  google_id?: string | undefined = '';
  cultureGroup?: Array<Schema.Types.ObjectId> = [];
  facebook_id?: string | undefined = '';
  stripe_customerId: string | null = '';
  email?: string | undefined = '';
  employeeId?: number | null = null;
  password?: string | null | undefined = '';
  profilePicUrl?: string | undefined = '';
  role?: Role | undefined;
  roleId?: Schema.Types.ObjectId | null = new ObjectId('');
  verified?: boolean | undefined = true;
  status?: boolean | undefined = true;
  createdAt: Date = new Date();
  updatedAt?: Date | undefined = new Date();
  type: USER_TYPE.ADMIN | USER_TYPE.SUPER_ADMIN | USER_TYPE.USER = USER_TYPE.USER
  firstName: string = '';
  lastName: string = '';
  dateOfBirth: Date = new Date();
  phoneNumber: string = '';
  location: LocationDTO = new LocationDTO()
  socialLinks?: SocialLinksDTO = new SocialLinksDTO()
  business: Schema.Types.ObjectId = new ObjectId('');
  businessId: Schema.Types.ObjectId = new ObjectId('');
  bio: string = '';
  gender: string = '';
  skills: Array<Schema.Types.ObjectId> = [];
  reward: RewardDTO = new RewardDTO();
  profileviews: number | 0;
  website: string = '';
  lifeExperience: Array<Schema.Types.ObjectId> = [];
  position: string = '';
  isMentor: boolean = false;
  permissions?: string[] | undefined = [];
  createdBy?: Schema.Types.ObjectId | undefined = new ObjectId('');
  businessQuestionsAnswered: boolean = true;
  following: Schema.Types.ObjectId[];
  modifiedBy?: Schema.Types.ObjectId | undefined = new ObjectId('');
  invitationHash?: string = ''
  invitationHashExpiryDate?: Date = new Date()
  isinvitationHashExpired?: boolean = false
  coverPicUrl: string = ''
  isDeleted?: boolean = false
  isActive?: boolean = false
  departmentId: Schema.Types.ObjectId = new ObjectId('');
  mentorship?: MentorshipDTO = new MentorshipDTO()
  ethnicity?: string = Ethnicity_Codes.Prefer_not_to_disclose
  // race?: string = ''
  personOfColor?: string = PersonOfColor_Enum.OTHER
  tenure?: Number = 0
  assessmentScore?: Number = 1
  assessmentScoreDate?: Date = new Date()
  performanceScore?: Number = 1
  performanceScoreDate?: Date = new Date()
  salary?: Number = 0
  hireDate: Date = new Date();
  jobLevel?: jobLevel_Enums = jobLevel_Enums.Entry_level
  supervisorId?: Schema.Types.ObjectId | undefined = new ObjectId('')
  enpsRating?: number = 0
  disability?: 'yes' | 'no' = 'no'
  diverse?: boolean = false
  women?: boolean = false
  poc?: boolean = false
  isMfaVerified?: boolean = false
  mfaVerificationType?: string = "none"
  verificationOtp?: {
    otp: string;
    expiresAt: Date;
  } = {
    otp: '',
    expiresAt: new Date(),
  }
  
}

export default interface IUser {
  _id: Schema.Types.ObjectId,
  email?: string;
  employeeId?: number | null;
  profileviews: number;
  password?: string | null;
  profilePicUrl?: string;
  role?: Role;
  fcm_token?: Array<any>;
  roleId?: Schema.Types.ObjectId | null;
  verified?: boolean;
  blocked_transactions?: boolean;
  status?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  cultureGroup?: Array<Schema.Types.ObjectId>;
  type: USER_TYPE.ADMIN | USER_TYPE.SUPER_ADMIN | USER_TYPE.USER

  firstName: string,
  lastName: string,
  dateOfBirth: Date,

  phoneNumber: string,
  location: LocationDTO,
  reward: RewardDTO,
  business: Schema.Types.ObjectId,
  bio: string,
  gender: string,
  skills?: Array<Schema.Types.ObjectId>,
  website: string,
  socialLinks?: ISocialLinks
  lifeExperience?: Array<Schema.Types.ObjectId>,
  businessId: Schema.Types.ObjectId,
  position: string,
  isMentor: boolean,
  permissions?: string[],
  createdBy?: Schema.Types.ObjectId | undefined,
  businessQuestionsAnswered: boolean,
  following: Schema.Types.ObjectId[],
  modifiedBy?: Schema.Types.ObjectId | undefined,
  invitationHash?: string
  invitationHashExpiryDate?: Date
  isinvitationHashExpired?: boolean
  coverPicUrl: string
  isDeleted?: boolean
  isActive?: boolean

  departmentId: Schema.Types.ObjectId
  mentorship?: MentorshipDTO
  ethnicity?: string
  // race?: string
  personOfColor?: string
  tenure?: Number
  assessmentScore?: Number
  assessmentScoreDate?: Date
  performanceScore?: Number
  performanceScoreDate?: Date
  salary?: Number
  hireDate?: Date
  jobLevel?: jobLevel_Enums
  supervisorId?: Schema.Types.ObjectId | undefined
  enpsRating?: number
  disability?: 'yes' | 'no'
  diverse?: boolean
  women?: boolean
  poc?: boolean
  isMfaVerified?: boolean
  mfaVerificationType?: string
  verificationOtp?: Object
}

const otpSchema = new Schema({
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

const schema = new Schema<IUser>(
  {
    email: {
      type: Schema.Types.String,
      required: false,
      // unique: true,
      trim: true,
      // select: false,
    },
    employeeId: {
      type: Schema.Types.Number,
      required: false,
    },
    password: {
      type: Schema.Types.String,
      required: false,
      select: false,
    },
    profileviews: {
      type: Schema.Types.Number,
      required: false,
      default: 0,
    },
    profilePicUrl: {
      type: Schema.Types.String,
      required: false,
      trim: true,
    },
    cultureGroup: [{ type: Schema.Types.ObjectId, required: false, ref: 'Cultur' }],
    firstName: {
      type: Schema.Types.String,
      required: false,
      trim: true,
    },
    lastName: {
      type: Schema.Types.String,
      required: false,
      trim: true,
    },
    dateOfBirth: {
      type: Schema.Types.Date,
      required: false,
    },
    phoneNumber: {
      type: Schema.Types.String,
      required: false,
    },
    location: {
      type: Schema.Types.Mixed,
      required: false,
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
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Businesses',
      required: false,
    },
    following: {
      type: [Schema.Types.ObjectId],
      ref: USER_DOCUMENT_NAME,
      required: false,
      default: []
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Businesses',
      required: false,
      // strictPopulate: false,
    },
    fcm_token: { type: Schema.Types.Array, required: false },
    bio: { type: Schema.Types.String, required: false },
    gender: { type: Schema.Types.String, required: false },
    skills: [{ type: Schema.Types.ObjectId, required: false, ref: 'userSkills' }],
    website: { type: Schema.Types.String, required: false },
    socialLinks: {
      facebook: { type: Schema.Types.String, required: false },
      linkedin: { type: Schema.Types.String, required: false },
      instagram: { type: Schema.Types.String, required: false },
      twitter: { type: Schema.Types.String, required: false },
    },
    lifeExperience: [{ type: Schema.Types.ObjectId, required: false, ref: 'Life' }],

    position: { type: Schema.Types.String, required: false },
    isMentor: { type: Schema.Types.Boolean, required: false },

    permissions: [{ type: Schema.Types.Mixed, required: false, enum: [Permissions.ANNOTATE_FILES, Permissions.BECOME_A_MENTOR, Permissions.BRAND_CULTURE_STRATEGY, Permissions.COMMENT, Permissions.CREATE_CAMPAIGN, Permissions.CREATE_COURSES, Permissions.CREATE_EVENTS, Permissions.CREATE_FOLDERS, Permissions.CREATE_POLLS, Permissions.CREATE_RESOURCE_GROUP, Permissions.CREATE_REWARDS_PROGRAM, Permissions.CREATE_SURVEYS, Permissions.CREATE_TASKS, Permissions.CREATE_WORKSPACE, Permissions.DOWNLOAD_FILES, Permissions.MANAGE_AGENDA, Permissions.MANAGE_BRAND_ASSETS, Permissions.REVIEW, Permissions.SHARE_FOR_REVIEW, Permissions.UPLOAD_FILES, Permissions.USE_PEN_ERASE, Permissions.VOTE_IN_POLLS] }],
    createdBy: { type: Schema.Types.ObjectId, required: false },
    modifiedBy: { type: Schema.Types.ObjectId, required: false },
    businessQuestionsAnswered: {
      type: Schema.Types.Boolean,
      required: false,
      default: true
    },

    type: {
      type: Schema.Types.String,
      required: true,
      // enum: [USER_TYPE.ADMIN, USER_TYPE.SUPER_ADMIN, USER_TYPE.USER]
    },
    reward: {
      points: { type: Schema.Types.Number, default: 0, min: 0 },
      pointsToSend: { type: Schema.Types.Number, default: 0, min: 0 },
      pointsToReedem: { type: Schema.Types.Number, default: 0, min: 0 },
      amount: { type: Schema.Types.Number, default: 0, min: 0 },
    },
    verified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    blocked_transactions: {
      type: Schema.Types.Boolean,
      default: false,
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
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
    invitationHash: { type: Schema.Types.String, required: false },
    invitationHashExpiryDate: { type: Schema.Types.Date, required: false },
    isinvitationHashExpired: { type: Schema.Types.Boolean, default: false },
    coverPicUrl: { type: Schema.Types.String, required: false },
    isDeleted: {
      type: Schema.Types.Boolean,
      default: false,
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: false,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      // ref: DEPARTMENT_DOCUMENT_NAME,
      ref: 'Department',
      required: false,
    },
    mentorship: {
      isOpenToMentorship: { type: Schema.Types.Boolean, default: false },
      isLookingForMentorship: { type: Schema.Types.Boolean, default: false }
    },
    ethnicity: {
      type: Schema.Types.String,
      required: false,
      enum: ['',...enumMapper(Ethnicity_Codes)]
    },
    // race: {
    //   type: Schema.Types.String,
    //   required: false,
    // },
    personOfColor: {
      type: Schema.Types.String,
      required: false,
    },
    tenure: {
      type: Schema.Types.Number,
      required: false,
    },
    assessmentScore: {
      type: Schema.Types.Number,
      required: false,
    },
    assessmentScoreDate: {
      type: Schema.Types.Date,
      required: false,
    },
    performanceScore: {
      type: Schema.Types.Number,
      required: false,
    },
    performanceScoreDate: {
      type: Schema.Types.Date,
      required: false,
    },
    salary: {
      type: Schema.Types.Number,
      required: false,
    },
    hireDate: {
      type: Schema.Types.Date,
      required: false,
    },
    jobLevel: {
      type: Schema.Types.String,
      required: false,
      enum: ['',...enumMapper(jobLevel_Enums)],
      default: jobLevel_Enums.Entry_level
    },
    supervisorId: { 
      type: Schema.Types.ObjectId, 
      required: false 
    },
    enpsRating: {
      type: Schema.Types.Number,
      required: false,
    },
    disability: {
      type: Schema.Types.String,
      required: false,
      default: 'no'
    },
    diverse: {
      type: Schema.Types.Boolean,
      required: false,
      // default: false
    },
    women: {
      type: Schema.Types.Boolean,
      required: false,
      // default: false
    },
    poc: {
      type: Schema.Types.Boolean,
      required: false,
      // default: false
    },
    isMfaVerified: {
      type: Schema.Types.Boolean,
      default: false,
      required: false,
      // default: false
    },
    mfaVerificationType: {
      type: Schema.Types.String,
      default: 'none',
      required: false,
      // default: false
    },
    verificationOtp: {
      type: otpSchema,
      default: null,
      required: false,
      // default: false
    },
  },
  {
    versionKey: false,
    timestamps: true
  },
);

export const UserModel = model<IUser>(USER_DOCUMENT_NAME, schema, USER_COLLECTION_NAME);

//TODO: Create mechanism of default password.