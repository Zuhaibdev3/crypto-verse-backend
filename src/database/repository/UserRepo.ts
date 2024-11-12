import Role, { RoleModel } from '../model/Role';
import { InternalError } from '../../core/ApiError';
import mongoose, { ObjectId, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import KeystoreRepo from './KeystoreRepo';
import Keystore from '../model/Keystore';
import { injectable } from 'inversify';
import IUserRepository from './iuser.repository';
import Repository from '../../repository/repository';
import { DatabaseId } from '../../../types';
import { User, UserModel, USER_TYPE } from '../../Api/Components/user/user.entity';
import { UpdateWalletDetailPayloadDTO } from '../../Interface/payloadInterface';
// import Role, { RoleModel } from '../../database/model/Role';

export const selectString = "+email +password +role ";
export const selectArray = [
  '_id',
  'name',
  'role',
  'email',
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
  async find(query: any): Promise<User[]> {
    const a = await UserModel.find({ ...query })
      .select('+email +role +updatedAt') // -verified -status
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
    let a: any = await UserModel.findOne({ _id: id, })
      .select(selectString)
      .populate({
        path: 'role',
        // select: "-status"
      })
      .lean<User>()
      .exec();
    if (!a) return null;
    return a
  }

  async updatePassword(userId: Schema.Types.ObjectId, newPassword: string) {
    return await UserModel.findByIdAndUpdate(
      userId,
      { password: newPassword, otp: null, otpExpiry: null }, // Reset OTP fields and verified status
      { new: true }
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    let a: any = await UserModel.findOne({ email: email, })
      .select('+email +password +role')
      .populate({
        path: 'role',
      })
      .lean<User>()
      .exec();
    if (!a) return null;
    return a
  }

  async findByWalletAddress(walletAddress: string): Promise<User | null> {
    let a: any = await UserModel.findOne({ walletAddress: walletAddress, })
      .select('+walletAddress')
      .populate({
        path: 'role',
        // select: "-status"
      })
      .lean<User>()
      .exec();
    if (!a) return null;
    return a
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


  async create(user: User, accessTokenKey: string, refreshTokenKey: string, roleCode: string,): Promise<{ user: User; keystore: Keystore }> {
    const now = new Date();
    console.log("Trigger hua 3")
    const role = await RoleModel.findOne({ code: roleCode })
      .select('+walletAddress role')
      .lean<Role>()
      .exec();
    if (!role) throw new InternalError('Role must be defined in db!');
    user.role = role._id;
    user.createdAt = user.updatedAt = now;
    console.log("Trigger hua 1 ")

    if (user.password) user.password = bcrypt.hashSync(user.password, 10);

    const createdUser = await UserModel.create(user);
    createdUser.populate({ path: 'role', select: "-status" })
    //@ts-ignore
    const keystore = await KeystoreRepo.create(createdUser._id, accessTokenKey, refreshTokenKey);

    return { user: createdUser.toObject(), keystore: keystore };

  }

  // async createUser(
  //   user: User,
  //   roleCode: any,
  // ): Promise<{ user: User }> {
  //   const now = new Date();

  //   // const role = await RoleModel.findOne({
  //   //   $and: [
  //   //     { code: roleCode },
  //   //     { businessId: user.businessId }
  //   //   ]
  //   // })
  //   //   .select('+email +password +telegram_id')
  //   //   .lean<Role>()
  //   //   .exec();
  //   // if (!role) throw new InternalError('Role must be defined in db!');

  //   user.password = user.password ? bcrypt.hashSync(user.password, 10) : null;
  //   // user.role = role._id;

  //   // user.type = roleCode
  //   user.type = USER_TYPE.USER
  //   user.createdAt = user.updatedAt = now;
  //   console.log('user...', user)
  //   // return {user}
  //   const createdUser = await UserModel.create(user);
  //   createdUser.populate({
  //     path: 'role',
  //     select: "-status"
  //   })
  //   // return { user: {} }
  //   // const keystore = await KeystoreRepo.create(createdUser._id, accessTokenKey, refreshTokenKey);
  //   return { user: createdUser.toObject() };

  // }


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

  // Update OTP and expiry for a user
  async updateOtp(userId: Schema.Types.ObjectId, otp: number, otpExpiry: Date) {
    return await UserModel.findByIdAndUpdate(
      userId,
      { otp, otpExpiry },
      { new: true } // This option returns the updated document
    );
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
      .findOneAndUpdate({ email }, { ...(user.profilePicUrl ? { profilePicUrl: user.profilePicUrl } : {}) }, { new: true, runValidators: true })
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




}