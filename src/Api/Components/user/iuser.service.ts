import { ObjectId } from 'mongoose';
import { DatabaseId } from '../../../../types';
import { RoleCode } from '../../../database/model/Role';
import { CreateUserDTO, GetaAllUserDTO } from './user.dto';
import { User } from './user.entity';
import { generateTokenDataDTO } from '../../../Services/dto/token.dto';
import { Schema } from 'mongoose';



export interface IUserService {

  patchUserStatusBySuperAdmin(targetUserId: DatabaseId, targetUserStatusId: DatabaseId): Promise<CreateUserDTO>
  patchUserStatusByAdmin(targetUserId: DatabaseId, targetUserStatusId: DatabaseId, requesterBusinessId: DatabaseId): Promise<CreateUserDTO>
  getUserByEmail(email: string): Promise<User>
  updateUserPassword(userId:DatabaseId,hashedPassword:string,businessId:DatabaseId,role:string) : Promise<any>
  getUserTokenData(bodyData: object): Promise<generateTokenDataDTO>
  getBusinessScoreCardData(businessId : Schema.Types.ObjectId): Promise<any[]>
}
