import { DatabaseId } from "../../types";
import { BadRequestError } from "../core/ApiError";
import { AdminMetaDataDTO, MetaDataDTO, SuperAdminMetaDataDTO, UserMetaDataDTO } from "../dto/index.dto";

declare type Class<T = any> = new (...args: any[]) => T;

export class tokenDataParser {


  static getSuperAdminTokenMetaData(userData: any): SuperAdminMetaDataDTO {

    // if (userData?.role !== RoleCode.SUPER_ADMIN ) throw new BadRequestError('Invalid Role')
    if (!userData._id) throw new BadRequestError("invalid token")
    if (userData?.business && userData?.businessId) throw new BadRequestError("invalid token")

    const createdBy: string | DatabaseId = userData._id
    const updatedBy: string | DatabaseId = userData._id
    const isDeleted: Boolean = false
    return { createdBy, updatedBy, isDeleted }
  }

  static getAdminTokenMetaData(userData: any): AdminMetaDataDTO {

    // if (userData?.role !== RoleCode.SUPER_ADMIN ) throw new BadRequestError('Invalid Role')
    if (!userData._id) throw new BadRequestError("invalid token")
    if (!userData?.business?._id && !userData?.businessId) throw new BadRequestError("invalid token")

    const createdBy: DatabaseId = userData._id
    const updatedBy: DatabaseId = userData._id
    const isDeleted: Boolean = false
    const businessId = userData?.business?._id || userData?.businessId

    return { createdBy, updatedBy, isDeleted, businessId }
  }

  static getUserTokenMetaData(userData: any): UserMetaDataDTO {

    // if (userData?.role !== RoleCode.SUPER_ADMIN ) throw new BadRequestError('Invalid Role')
    if (!userData._id) throw new BadRequestError("invalid token")
    if (!userData?.business?._id && !userData?.businessId) throw new BadRequestError("invalid token")

    const createdBy: DatabaseId = userData._id
    const updatedBy: DatabaseId = userData._id
    const isDeleted: Boolean = false
    const businessId = userData?.business?._id || userData?.businessId
    const updatedAt = new Date()

    return { createdBy, updatedBy, isDeleted, businessId, updatedAt }
  }

}
