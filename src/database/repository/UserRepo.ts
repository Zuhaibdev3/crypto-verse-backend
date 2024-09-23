import Role, { RoleModel } from '../model/Role';
import { InternalError } from '../../core/ApiError';
import mongoose, { ObjectId, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import KeystoreRepo from './KeystoreRepo';
import Keystore from '../model/Keystore';
import { injectable } from 'inversify';
import IUserRepository from './iuser.repository';
import Repository from '../../repository/repository';
import { DatabaseId } from '../../../types';
import { User, INSTRUCTOR_PERMISSION, UserModel, USER_TYPE } from '../../Api/Components/user/user.entity';
// import Role, { RoleModel } from '../../database/model/Role';

export const selectString = "+email +password +role +telegram_id +date_of_birth +bio +phone +website +facebook_link +twitter_link +instagram_link +linkedin_link";
export const selectArray = [
  '_id',
  'name',
  'role',
  'email',
  'telegram_id',
  'date_of_birth',
  'bio',
  "businessQuestionsAnswered",
  'phone',
  'website',
  'facebook_link',
  'twitter_link',
  'instagram_link',
  'businessQuestionsAnswered',
  'linkedin_link'
];
@injectable()
// export default class UserRepo extends Omit<Repository<User>, 'create' | 'delete' | 'findById' | 'update' > implements IUserRepository {
export default class UserRepo
  // extends Repository<User>
  implements IUserRepository {
  model = UserModel

  findUsers(): Promise<User[]> {
    let a = UserModel.find()
      .select('+email +password +role') // -verified -status
      .populate({
        path: 'role',
        select: "-status"
      })
      .lean<User[]>()
      .exec();
    console.log('a////', a)

    return a
  }
  // contains critical information of the user
  async find(role: Role, query: any): Promise<User[]> {
    const a = await UserModel.find({ role: { $ne: role._id }, ...query })
      .select('+email +role') // -verified -status
      .populate({
        path: 'role',
        select: "-status"
      })
      .lean<User[]>()
      .exec();
    // console.log("a....find", a)
    return a
  }


  async findById(id: Types.ObjectId): Promise<User | null> {
    // try {
    let a: any = await UserModel.findOne({ _id: id, status: true })
      .select(selectString)
      .populate({
        path: 'role roleId business businessId businessId.features business.features skills lifeExperience cultureGroup',
        // select: "-status"
      })
      .lean<User>()
      .exec();
    let rolesData;

    if (!('business' in a)) {
      a.business = a?.businessId
      a.businessId = a?.businessId?._id
    } else {
      a.businessId = a?.business?._id
    }

    // } catch (error) {
    //   console.log("error...", error)
    // }

    // .populate({
    //   path: 'features', // Field name from your schema
    //   model: FEATURES_COLLECTION_NAME, // The model to use for populating
    //   select: '-_id' // Specify the fields you want to select from the features collection
    // })

    return a
  }

  findByBusiness(id: Types.ObjectId): Promise<User[] | null> {
    return UserModel.find({ status: true, business: id, permissions: INSTRUCTOR_PERMISSION })
      .lean<User[]>()
      .exec();
  }


  async getUserWithCoursesByBusiness(id: Types.ObjectId): Promise<any> {
    const data = await UserModel.aggregate([
      {
        $match: {
          status: true,
          business: id,
          permissions: INSTRUCTOR_PERMISSION
        }
      },
      {
        $lookup: {
          from: "courses",
          let: { instructorId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$instructor", "$$instructorId"] }
              }
            }
          ],
          as: "courses"
        }
      },
      {
        $project: {
          _id: 1,
          first_name: 1,
          last_name: 1,
          profilePicUrl: 1,
          email: 1,
          courseCount: { $size: "$courses" }
        }
      }
    ])
    return data
  }
  async getUserWithCoursesByUserId(id: Types.ObjectId): Promise<any> {
    const data = await UserModel.aggregate([
      {
        $match: {
          status: true,
          _id: id,
          permissions: INSTRUCTOR_PERMISSION
        }
      },
      {
        $lookup: {
          from: "courses",
          let: { instructorId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$instructor", "$$instructorId"] }
              }
            }
          ],
          as: "courses"
        }
      },
      {
        $project: {
          _id: 1,
          first_name: 1,
          last_name: 1,
          profilePicUrl: 1,
          email: 1,
          courseCount: { $size: "$courses" }
        }
      }
    ])
    return data
  }

  async findByEmail(email: string): Promise<User | null> {
    let a: any = await UserModel.findOne({ email: email, status: true })
      .select('+email +password +role +telegram_id')
      .populate({
        path: 'role roleId business businessId businessId.features business.features skills lifeExperience cultureGroup',
        // select: "-status"
      })
      .lean<User>()
      .exec();
    let rolesData;
    // if (!a) throw new BadRequestError('Invalid credentials');
    if (!a) return null;
    if (!('business' in a)) {
      a.business = a?.businessId
      a.businessId = a?.businessId?._id
    } else {
      a.businessId = a?.business?._id
    }

    return a
  }

  findByTelegram(telegram_id: string): Promise<User | null> {
    return UserModel.findOne({
      // $or: [
      //   { email },
      //   { google_id }
      // ]
      telegram_id, status: true
    })
      .select('+email +password +role +telegram_id')
      .populate({
        path: 'role',
        select: "-status"
      })
      .lean<User>()
      .exec();
  }

  findByGoogle(google_id: string, email: string): Promise<User | null> {
    return UserModel.findOne({
      $or: [
        { email },
        { google_id }
      ]
    })
      .select('+email +password +role +google_id')
      .populate({
        path: 'role',
        select: "-status"
      })
      .lean<User>()
      .exec();
  }

  findProfileById(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findOne({ _id: id, status: true })
      .select('+role +telegram_id')
      .populate({
        path: 'role',
        select: "-status"
      })
      .lean<User>()
      .exec();
  }

  findPublicProfileById(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findOne({ _id: id, status: true }).lean<User>().exec();
  }

  async getRoleIdsByInstructorPermission(businessId: Types.ObjectId): Promise<any[]> {
    const result = await RoleModel.aggregate([
      {
        $match: {
          businessId: businessId,
          features: { $elemMatch: { $eq: "658c23ff7d9c1c0560352c43" } }
        }
      },
      {
        $group: {
          _id: null,
          roleIds: { $push: "$_id" }
        }
      },
      { $unset: ["_id"] }
    ]);

    return result
  }

  async getInstructorsByRoleIds(roleIds: string[]): Promise<any[]> {
    console.log(roleIds, "roleIds")
    const result = UserModel.aggregate([
      {
        $match: {
          roleId: {
            $in: roleIds
          }
        }
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1
        }
      }
    ]);

    return result
  }


  async create(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
    roleCode: string,
  ): Promise<{ user: User; keystore: Keystore }> {
    const now = new Date();

    const role = await RoleModel.findOne({ code: roleCode })
      .select('+email +password +telegram_id')
      .lean<Role>()
      .exec();
    if (!role) throw new InternalError('Role must be defined in db!');

    user.password = user.password ? bcrypt.hashSync(user.password, 10) : null;
    user.role = role._id;
    user.createdAt = user.updatedAt = now;

    const createdUser = await UserModel.create(user);
    createdUser.populate({
      path: 'role',
      select: "-status"
    })
    //@ts-ignore
    const keystore = await KeystoreRepo.create(createdUser._id, accessTokenKey, refreshTokenKey);

    return { user: createdUser.toObject(), keystore: keystore };

  }

  async createUser(
    user: User,
    roleCode: any,
  ): Promise<{ user: User }> {
    const now = new Date();

    // const role = await RoleModel.findOne({
    //   $and: [
    //     { code: roleCode },
    //     { businessId: user.businessId }
    //   ]
    // })
    //   .select('+email +password +telegram_id')
    //   .lean<Role>()
    //   .exec();
    // if (!role) throw new InternalError('Role must be defined in db!');

    user.password = user.password ? bcrypt.hashSync(user.password, 10) : null;
    // user.role = role._id;

    // user.type = roleCode
    user.type = USER_TYPE.ADMIN
    user.createdAt = user.updatedAt = now;
    console.log('user...', user)
    // return {user}
    const createdUser = await UserModel.create(user);
    createdUser.populate({
      path: 'role',
      select: "-status"
    })
    // return { user: {} }
    // const keystore = await KeystoreRepo.create(createdUser._id, accessTokenKey, refreshTokenKey);
    return { user: createdUser.toObject() };

  }


  async update(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
  ): Promise<{ user: User; keystore: Keystore }> {
    user.updatedAt = new Date();
    await UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
      .lean()
      .exec();
    //@ts-ignore
    const keystore = await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey);
    return { user: user, keystore: keystore };
  }

  async delete(id: Types.ObjectId): Promise<User | null> {
    const user_deleted: any = await UserModel.findByIdAndDelete(id);
    if (!user_deleted) throw new InternalError('Role must be defined in db!');
    return user_deleted
  }

  async updateInfo(_id: string, user: User): Promise<User | null> {
    user.updatedAt = new Date();
    const user_updated = await UserModel
      .findByIdAndUpdate(_id, { $set: { ...user } }, { new: true, runValidators: true })
      .populate({
        path: 'role',
        select: "-status"
      })
      .lean()
      .exec()
    // @ts-ignore
    return user_updated;
  }

  async findByNameAndBusinessId(userName: string, businessId: DatabaseId, page: number, limit: number): Promise<User[] | null> {
    const user: any = this.model.find({
      "$expr": {
        "$regexMatch": {
          "input": { "$concat": ["$first_name", " ", "$last_name"] },
          "regex": `${userName}`,  //Your text search here
          "options": "i"
        }
      },
      business: businessId
    })
      .select("first_name last_name email")
      .skip((page - 1) * limit)
      .limit(limit);
    return user
  }

  public static async updateProfilePic(_id: string, user: User): Promise<User | null> {
    user.updatedAt = new Date();
    const user_updated = await UserModel
      .findByIdAndUpdate(_id, { $set: { profilePicUrl: user.profilePicUrl } }, { new: true, runValidators: true })
      .populate({
        path: 'role',
        select: "-status"
      })
      .lean()
      .exec()
    // @ts-ignore
    return user_updated;
  }

  public static async updateProfilePicByEmail(email: string, user: User): Promise<User | null> {
    user.updatedAt = new Date();
    const user_updated = await UserModel
      .findOneAndUpdate({ email }, { ...(user.profilePicUrl ? { profilePicUrl: user.profilePicUrl } : { coverPicUrl: user.coverPicUrl }) }, { new: true, runValidators: true })
      .populate({
        path: 'role',
        select: "-status"
      })
      .lean()
      .exec();
    console.log(user_updated)
    // @ts-ignore
    return user_updated as any;
  }

  public static async addFcmToken(user: User): Promise<User | null> {
    user.updatedAt = new Date();
    const user_updated = await UserModel
      .findByIdAndUpdate(user._id, { fcm_token: user.fcm_token }, { new: true, runValidators: true })
      .populate({
        path: 'role',
        select: "-status"
      })
      .lean()
      .exec();
    console.log(user_updated)
    // @ts-ignore
    return user_updated as any;
  }

  public static async getUsersRecommendations(userData: User): Promise<any> {
    return await UserModel
      .find(
        {
          _id: { $nin: [...userData.following, userData._id] }, $or: [
            { businessId: userData.businessId },
            { business: userData.business }
          ]
        },
        { firstName: 1, lastName: 1, profilePicUrl: 1, _id: 1 }
      )
      .exec()
      .then((foundUsers: any) => {
        if (foundUsers.length === 0) {
          return [];
        }
        return foundUsers;
      });
  }

  public static async updateSkills(_id: ObjectId, user: User): Promise<any> {
    user.updatedAt = new Date();
    const user_updated = await UserModel
      .findByIdAndUpdate(_id, { $set: { skills: user.skills } }, { new: true, runValidators: true })
      .populate({
        path: 'role',
        select: "-status"
      })
      .lean()
      .exec()
    // @ts-ignore
    return user_updated;
  }
  public static async updateDescription(_id: ObjectId, user: User): Promise<any> {
    user.updatedAt = new Date();
    const user_updated = await UserModel
      .findByIdAndUpdate(_id, { $set: { bio: user.bio } }, { new: true, runValidators: true })
      .populate({
        path: 'role',
        select: "-status"
      })
      .lean()
      .exec()
    // @ts-ignore
    return user_updated;
  }

  public static async updateLifeExperience(_id: ObjectId, user: User): Promise<any> {
    user.updatedAt = new Date();
    const user_updated = await UserModel
      .findByIdAndUpdate(_id, { $set: { lifeExperience: user.lifeExperience } }, { new: true, runValidators: true })
      .populate({
        path: 'role',
        select: "-status"
      })
      .lean()
      .exec()
    // @ts-ignore
    return user_updated;
  }
  public static async updateCultureGoup(_id: ObjectId, user: User): Promise<any> {
    user.updatedAt = new Date();
    const user_updated = await UserModel
      .findByIdAndUpdate(_id, { $set: { cultureGroup: user.cultureGroup } }, { new: true, runValidators: true })
      .populate({
        path: 'role',
        select: "-status"
      })
      .lean()
      .exec()
    // @ts-ignore
    return user_updated;
  }

  public static async updateBio(_id: ObjectId, user: User): Promise<any> {
    user.updatedAt = new Date();
    const user_updated = await UserModel
      .findByIdAndUpdate(_id, { $set: { bio: user.bio } }, { new: true, runValidators: true })
      .populate({
        path: 'role',
        select: "-status"
      })
      .lean()
      .exec()
    // @ts-ignore
    return user_updated;
  }
  public static async updateMentorshipStatus(_id: ObjectId, user: User): Promise<any> {
    user.updatedAt = new Date();
    return await UserModel
      .findByIdAndUpdate(_id, { $set: { isMentor: user.isMentor } }, { new: true, runValidators: true })
      .populate({
        path: 'role',
        select: "-status"
      })
      .lean()
      .exec()
  }

  public static async getFollowing(user: User): Promise<any> {
    return await UserModel
      .find({ _id: { $in: user.following } })
      .exec()
      .then((foundUsers) => {
        if (foundUsers.length === 0) {
          return [];
        }
        return foundUsers;
      });
  }

  public static async updateProfileView(_id: string): Promise<any> {
    return await UserModel
      .findByIdAndUpdate(_id, { $inc: { profileviews: 1 } }, { new: true, runValidators: true })
      .lean()
      .exec()
  }

  public static async getUsersWithSurveyPermission(user: User, page: any, limit: any, searchQuery: String): Promise<any> {
    // Fetch roles matching the specified criteria
    const rolesResponse = await RoleModel.aggregate([
      {
          $match: {
              features: {
                  $elemMatch: {
                      // modifier = survey (_id)
                      $eq: "650ada07a31f44888597fd68",
                  },
                  // modifier != surveyAdminPermission (_id)
                  $not: { $elemMatch: { $eq: "65550011a4e9427cf525ce44" } }
              }
          }
      },
      {
          $group: {
              _id: null,
              roles: { $push: "$_id" }
          }
      },
      {
          $unset: ["_id"]
      }
    ]);

    // Extract roleIds from rolesResponse and convert them to string
    const roleIds: string[] = (rolesResponse[0]?.roles || []).map((roleId: { toString: () => any; }) => roleId.toString()) as string[];

    // Fetch user data based on roleIds and businessId
    const users = await UserModel.find({ 
      roleId: { $in: roleIds }, 
      businessId: user.businessId,
      $or: [
        { firstName: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search by first name
        { lastName: { $regex: searchQuery, $options: 'i' } }   // Case-insensitive search by last name
      ],
    })
    .select("_id email firstName lastName profilePicUrl roleId businessId")
    .skip((page - 1) * limit) // Skip items from previous pages
    .limit(limit); // Limit items to current page
      
    // Return the fetched users
    return users;
  }
}