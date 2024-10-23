import { ObjectId } from 'mongoose';
import { IndustryPayloadDTO, UpdateIndustryPayloadDTO } from '../../../Interface/payloadInterface';
import { DatabaseId } from '../../../../types';
import { SuperAdminMetaDataDTO } from '../../../dto/index.dto';
import Industry from './stabilityai.entity';
import { PaginationDataDTO } from '../../../dto/common.dto';
import { DallePayloadDTO } from "../../../Interface/payloadInterface";
import { Request, Response } from 'express';

export interface IStabilityaiService {

  ImageToImageGeneration(req: Request, res: Response,): Promise<any>
}
