import { ObjectId } from 'mongoose';
import { IndustryPayloadDTO, UpdateIndustryPayloadDTO } from '../../../Interface/payloadInterface';
import { DatabaseId } from '../../../../types';
import { SuperAdminMetaDataDTO } from '../../../dto/index.dto';
import Files from './files.entity';
import { PaginationDataDTO } from '../../../dto/common.dto';

export interface IFilesService {

    upload(ImageData: any): Promise<Files>

}
