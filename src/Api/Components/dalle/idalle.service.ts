import { ObjectId } from 'mongoose';
import { IndustryPayloadDTO, UpdateIndustryPayloadDTO } from '../../../Interface/payloadInterface';
import { DatabaseId } from '../../../../types';
import { SuperAdminMetaDataDTO } from '../../../dto/index.dto';
import Industry from './dalle.entity';
import { PaginationDataDTO } from '../../../dto/common.dto';
import { DallePayloadDTO } from "../../../Interface/payloadInterface";

export interface IDalleService {

  add(bodyData: DallePayloadDTO): Promise<Industry>
  getAll(userId: DatabaseId, paginationData: PaginationDataDTO): Promise<any>
  getAllforAdmin(paginationData: PaginationDataDTO): Promise<any>
  get(id: string): Promise<Industry | null>
  update(bodyData: UpdateIndustryPayloadDTO, metaData: SuperAdminMetaDataDTO, industryId: string): Promise<Industry | null>
  delete(industryId: string): Promise<any>

}
