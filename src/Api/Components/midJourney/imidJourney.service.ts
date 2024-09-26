import { ObjectId } from 'mongoose';
import { IndustryPayloadDTO, UpdateIndustryPayloadDTO } from '../../../Interface/payloadInterface';
import { DatabaseId } from '../../../../types';
import { SuperAdminMetaDataDTO } from '../../../dto/index.dto';
import Industry from './midJourney.entity';
import { PaginationDataDTO } from '../../../dto/common.dto';
import {MidJourneyPayloadDTO } from "../../../Interface/payloadInterface";

export interface IMidJourneyService {

  add(bodyData: MidJourneyPayloadDTO): Promise<Industry>
  getAll(userId: DatabaseId, paginationData: PaginationDataDTO): Promise<any>
  getAllforAdmin(paginationData: PaginationDataDTO): Promise<any>
  get(id: string): Promise<Industry | null>
  update(bodyData: UpdateIndustryPayloadDTO, metaData: SuperAdminMetaDataDTO, industryId: string): Promise<Industry | null>
  delete(industryId: string): Promise<any>

}
