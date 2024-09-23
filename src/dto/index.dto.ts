import { Types } from 'mongoose';
import { DatabaseId } from '../../types';
export class CreatedByAndBusinessIdDTO {

  createdBy: DatabaseId;
  businessId: DatabaseId;

}
export class MetaDataDTO {

  createdBy: DatabaseId | string;
  updatedBy: DatabaseId | string;
  businessId: DatabaseId | string | null;
  isDeleted: Boolean;

}
export class SuperAdminMetaDataDTO {

  createdBy: string | DatabaseId = '';
  updatedBy: string | DatabaseId = '';
  isDeleted: Boolean = false;

}


export class AdminMetaDataDTO {

  createdBy: string | DatabaseId = '';
  businessId: string | DatabaseId = '';
  updatedBy: string | DatabaseId = ''
  isDeleted: Boolean = false;

}

export class UserMetaDataDTO {

  createdBy: DatabaseId
  businessId: DatabaseId
  updatedBy: DatabaseId
  isDeleted: Boolean = false;
  updatedAt: Date
}

export class MetaDTO {

  createdBy: DatabaseId;
  businessId: DatabaseId;
  updatedBy: DatabaseId
  updatedAt: Date

}
export class UpdateMetaDTO {

  updatedBy: DatabaseId
  updatedAt: Date

}


export class UpdatedByAndBusinessIdDTO {

  updatedBy: DatabaseId;
  businessId: DatabaseId;

}