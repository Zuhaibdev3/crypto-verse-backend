import { ObjectId } from "../../constants";
import { DatabaseId } from "../../types";

export class SuperAdminEntityDTO implements ISuperAdminEntity{
  createdBy: DatabaseId | any = new ObjectId("");
  updatedBy: DatabaseId | any = new ObjectId("");
  isDeleted: Boolean = false;
}

export interface ISuperAdminEntity {
  createdBy: DatabaseId | any;
  updatedBy: DatabaseId | any;
  isDeleted: Boolean;
}


export class UpdateMetaDataDTO {
  updatedBy: string = '';
}

export class PaginationDataDTO {
  page: number = 1;
  limit: number = 10;
}