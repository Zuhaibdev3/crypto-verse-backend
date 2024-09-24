import { Types } from 'mongoose';
import { DatabaseId } from '../../types';
export class CreatedByAndBusinessIdDTO {
  createdBy: DatabaseId;
}
export class MetaDataDTO {
  createdBy: DatabaseId | string;
  updatedBy: DatabaseId | string;
  isDeleted: Boolean;

}
export class SuperAdminMetaDataDTO {
  createdBy: string | DatabaseId = '';
  updatedBy: string | DatabaseId = '';
  isDeleted: Boolean = false;
}


export class AdminMetaDataDTO {

  createdBy: string | DatabaseId = '';
  updatedBy: string | DatabaseId = ''
  isDeleted: Boolean = false;
  userId:string | DatabaseId = '';

}

export class UserMetaDataDTO {

  createdBy: DatabaseId
  updatedBy: DatabaseId
  isDeleted: Boolean = false;
  updatedAt: Date
  userId:string | DatabaseId = '';
}

export class MetaDTO {

  createdBy: DatabaseId;
  updatedBy: DatabaseId
  updatedAt: Date

}
export class UpdateMetaDTO {
  updatedBy: DatabaseId
  updatedAt: Date
}


export class UpdatedByAndBusinessIdDTO {

  updatedBy: DatabaseId;
}