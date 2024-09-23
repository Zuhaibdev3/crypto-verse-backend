import IRepository from "../../repository/irepository";
import Keystore from "../model/Keystore";
import { Types } from 'mongoose';
import Role from '../model/Role';
import { DatabaseId } from "../../../types";
import { User } from "../../Api/Components/user/user.entity";
import { PatchUserProfileDTO } from "../../Interface/payloadInterface";

/**
 * User Interface
 */
export default interface IUserRepo
// extends Omit<IRepository<User>, 'create' | 'delete' | 'findById' | 'update' >
{
  create(arg0: any, accessTokenKey: any, refreshTokenKey: any, role: any): Promise<any>;

  findUsers(): Promise<User[]>
  find(role: Role, query: any): Promise<User[]>
  findById(id: Types.ObjectId): Promise<User | null>
  findByBusiness(id: Types.ObjectId): Promise<User[] | null>
  getUserWithCoursesByBusiness(id: Types.ObjectId): Promise<any>
  findByEmail(email: string): Promise<User | null>
  findByTelegram(telegram_id: string): Promise<User | null>
  findByGoogle(google_id: string, email: string): Promise<User | null>
  findProfileById(id: Types.ObjectId): Promise<User | null>
  findPublicProfileById(id: Types.ObjectId): Promise<User | null>
  createUser(user: User, roleCode: string): Promise<{ user: User }>
  update(user: User, accessTokenKey: string, refreshTokenKey: string): Promise<{ user: User; keystore: Keystore }>
  delete(id: Types.ObjectId): Promise<User | null>
  updateInfo(_id: Types.ObjectId | string, user: User | PatchUserProfileDTO): Promise<User | PatchUserProfileDTO | null>
  findByNameAndBusinessId(userName: string, businessId: DatabaseId, page: number, limit: number): Promise<User[] | null>
  getRoleIdsByInstructorPermission(businessId: Types.ObjectId): Promise<any[]>
  getInstructorsByRoleIds(roleIds: string[]): Promise<any[]>
}