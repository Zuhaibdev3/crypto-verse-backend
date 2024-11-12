import { ObjectId } from 'mongoose';
// import { NftPayloadDTO, UpdateNftPayloadDTO } from '../../../Interface/payloadInterface';
import { DatabaseId } from '../../../../types';
import { SuperAdminMetaDataDTO } from '../../../dto/index.dto';
import Nft from './nft.entity';
import { PaginationDataDTO } from '../../../dto/common.dto';
import { AdminMetaDataDTO, MetaDTO, UpdateMetaDTO, UserMetaDataDTO } from '../../../dto/index.dto';

export interface INftService {

  // add(bodyData: any, superAdminMetaData: SuperAdminMetaDataDTO): Promise<Nft>
  addMultiple(taskbodyData: any[], userData: MetaDTO): Promise<any>

  // add(bodyData: NftPayloadDTO, superAdminMetaData: SuperAdminMetaDataDTO): Promise<Nft>
  getAll(walletAddress: string, paginationData: PaginationDataDTO): Promise<any>
  // getAllforAdmin(paginationData: PaginationDataDTO): Promise<any>
  // get(id: string): Promise<Industry | null>
  // update(bodyData: UpdateIndustryPayloadDTO, metaData: SuperAdminMetaDataDTO, industryId: string): Promise<Industry | null>
  // delete(industryId: string): Promise<any>

}
