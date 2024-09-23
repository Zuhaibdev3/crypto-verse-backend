import { DataCopier } from "../../../utils/dataCopier";
import { IUserService } from './iuser.service';
import { inject, injectable } from 'inversify';
import { BadRequestError, ForbiddenError, NoDataError } from '../../../core/ApiError';
import SERVICE_IDENTIFIER from '../../../identifiers';
import { CreateUserDTO, GetaAllUserDTO } from './user.dto';
import IUserRepository from './iuser.repository';
import { DatabaseId } from "../../../../types";
import { User } from "./user.entity";
import bcrypt from 'bcrypt';
import { ObjectId } from "mongoose";
import { RoleCode } from "../../../database/model/Role";
import { generateTokenDataDTO } from "../../../Services/dto/token.dto";
import { Schema } from "mongoose";


@injectable()
export class UserService implements IUserService {

  constructor(
    @inject(SERVICE_IDENTIFIER.UserRepository)
    private userRepository: IUserRepository
  ) { }


  async patchUserStatusBySuperAdmin(userId: DatabaseId, userStatusId: DatabaseId): Promise<CreateUserDTO> {
    let result!: CreateUserDTO
    try {
      result = await this.userRepository.updateById(userId, { status: userStatusId })
    } catch (error) {
      throw new BadRequestError("Unabe to update user's status")
    }
    return result
  }


  async patchUserStatusByAdmin(targetUserId: DatabaseId, targetUserStatusId: DatabaseId, requesterBusinessId: DatabaseId): Promise<CreateUserDTO> {
    let result!: CreateUserDTO
    try {
      result = await this.userRepository.updateOne({ _id: targetUserId, businessId: requesterBusinessId }, { status: targetUserStatusId })
    } catch (error) {
      throw new BadRequestError("Unabe to update user's status")
    }
    return result
  }

  async getUserByEmail(email: string): Promise<User> {
    let result!: User
    try {
      result = await this.userRepository.findOne({ email }, "+email")
    } catch (error) {
      throw new BadRequestError("Unable to get user")
    }
    return result
  }
  async getBusinessScoreCardData(businessId: Schema.Types.ObjectId): Promise<any[]> {
    let result!: any[]
    try {
      result = await this.userRepository.getBusinessScoreCard(businessId)
    } catch (error) {
      throw new BadRequestError("Unable to get score card data")
    }
    return result
  }
  async updateUserPassword(targetedUserId: DatabaseId, hashedPassword: string): Promise<any> {
    let result!: User
    try {
      return result = await this.userRepository.updateOne({ _id: targetedUserId }, { password: hashedPassword })
      // if (role === RoleCode.SUPER_ADMIN) {
      // } else if (role === RoleCode.ADMIN) {
      //   return result = await this.userRepository.updateOne({ _id: targetedUserId, businessId }, { password: hashedPassword })
      // } else if (role === RoleCode.USER) {
      //   return result = await this.userRepository.updateOne({ _id: targetedUserId, businessId }, { password: hashedPassword })
      // }

    } catch (error) {
      throw new BadRequestError("Unable to get user")
    }
    // return result
  }
  async getUserTokenData(bodyData: object): Promise<generateTokenDataDTO> {
    //@ts-ignore
    return this.userRepository.getUserTokenData(bodyData)
  }
}