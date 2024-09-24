import { DatabaseId } from "../../types";
import { BadRequestError } from "../core/ApiError";
import { AdminMetaDataDTO, MetaDataDTO, SuperAdminMetaDataDTO, UserMetaDataDTO } from "../dto/index.dto";

declare type Class<T = any> = new (...args: any[]) => T;

export class tokenDataParser {


  static getSuperAdminTokenMetaData(userData: any): SuperAdminMetaDataDTO {
    if (!userData._id) throw new BadRequestError("invalid token")

    const createdBy: string | DatabaseId = userData._id
    const updatedBy: string | DatabaseId = userData._id
    const isDeleted: Boolean = false
    return { createdBy, updatedBy, isDeleted }
  }


  static getUserTokenMetaData(userData: any): UserMetaDataDTO {

    if (!userData._id) throw new BadRequestError("invalid token")
    const createdBy: DatabaseId = userData._id
    const updatedBy: DatabaseId = userData._id
    const isDeleted: Boolean = false
    const userId = userData?._id
    const updatedAt = new Date()

    return { createdBy, updatedBy, isDeleted, userId, updatedAt }
  }

}
