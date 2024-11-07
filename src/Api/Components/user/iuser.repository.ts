import { FilterQuery, ObjectId, Schema } from 'mongoose';
import IRepository from '../../../repository/irepository';
import User from './user.entity';
import { PaginationDataDTO } from '../../../dto/common.dto';
import { DatabaseId } from '../../../../types';

/**
 * Job Interface
 */
export default interface IUserRepository extends IRepository<User> {
  getUserTokenData(query: FilterQuery<any> | undefined): Promise<any>
  findAllUsers(query: any, pagination: any): Promise<any>
  findeOneByHash(query: any): Promise<any>
  findByIdAndPopulatePassword(id: string): Promise<any>
  deletManyUsers(userIds: string[]): Promise<any>
  deleteManyWithBusinessId(businessId: string): Promise<any>
  findById(id: string): Promise<any>
  backupMany(userIds: string[]): Promise<any>
  findAllUserAggregate(query: any, pagination: any, userId: DatabaseId): any
  findAllUserUsingRoleAggregate(query: any, pagination: any): any
  getCountUsingRole(query: any): any
  getBusinessScoreCard(businessId: Schema.Types.ObjectId): Promise<any[]>

  updateUserScoreCard(businessId: DatabaseId): Promise<any>

  getScorecardStats(businessId: DatabaseId, query: { category: string, culture_group: string }): Promise<any>

  getAllBusinessUsersForChat(businessId: DatabaseId, page: number, limit: number): Promise<any>
  deleteAllUsersExceptAdmin(businessId: DatabaseId, userId: DatabaseId): Promise<any>

}