import { Response, NextFunction } from "express"
import asyncHandler from "../../../helpers/async";
import { SuccessResponse } from '../../../core/ApiResponse';
import _ from 'lodash';
import { IStabilityaiService } from './istabilityai.service';
import { resolve } from "../../../dependencymanagement"
import SERVICE_IDENTIFIER from "../../../identifiers";
import { IndustryIdParamDTO, TextToImagePayloadDTO, IndustryPayloadDTO, UpdateIndustryPayloadDTO } from "../../../Interface/payloadInterface";

import { AdminMetaDataDTO } from "../../../dto/index.dto";
import { tokenDataParser } from "../../../utils/tokenDataParser";

export class StabilityaiController {

  getStabilityaiService(): IStabilityaiService {
    return resolve<IStabilityaiService>(SERVICE_IDENTIFIER.StabilityaiService);
  }

  StabilityaiService = this.getStabilityaiService();

  ImageToImageGeneration = asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
    let { _id: userId, walletAddress } = req.user
    const result = await this.StabilityaiService.ImageToImageGeneration(req, res, userId, walletAddress);
    new SuccessResponse('image generated successfully', result).send(res);
  })
  TextToImageGeneration = asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
    let { _id: userId, walletAddress } = req.user
    let bodyData: TextToImagePayloadDTO = req.body

    const result = await this.StabilityaiService.TextToImageGeneration(req.body, userId, walletAddress);
    new SuccessResponse('image generated successfully', result).send(res);
  })
  // generateImage =
  //   asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
  //     let bodyData: DallePayloadDTO = req.body
  //     // let { _id: userId } = req.user
  //     const adminMetaData: AdminMetaDataDTO = tokenDataParser.getUserTokenMetaData(req.user)

  //     let result = await this.DalleService.add(bodyData, adminMetaData)
  //     new SuccessResponse('image generated successfully', result).send(res);
  //   })

  // getAllforUser =
  //   asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
  //     const paginationData: PaginationDataDTO = paginationParser.getpaginationData(req.query)
  //     let { _id: userId } = req.user
  //     let result = await this.DalleService.getAllforUser(userId, paginationData)
  //     new SuccessResponse('found NFT successfully', result).send(res);
  //   })

  // getAllforAdmin =
  //   asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
  //     const paginationData: PaginationDataDTO = paginationParser.getpaginationData(req.query)
  //     let { _id: userId } = req.user
  //     let result = await this.DalleService.getAllforAdmin(paginationData)
  //     new SuccessResponse('All found industry successfully', result).send(res);
  //   })
  // get =
  //   asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
  //     const paramsData: IndustryIdParamDTO = req.params
  //     let result = await this.DalleService.get(paramsData.industryId)
  //     new SuccessResponse('found industry successfully', result).send(res);
  //   })

  // update =
  //   asyncHandler(async (req: any, res: Response): Promise<Response | void> => {
  //     let bodyData: UpdateIndustryPayloadDTO = req.body
  //     const paramsData: IndustryIdParamDTO = req.params
  //     const metaData: SuperAdminMetaDataDTO = tokenDataParser.getSuperAdminTokenMetaData(req.user)
  //     let result = await this.DalleService.update(bodyData, metaData, paramsData.industryId)
  //     new SuccessResponse('Updated successfully', result).send(res);
  //   })



  // delete =
  //   asyncHandler(async (req: any, res: Response): Promise<Response | void> => {
  //     const paramsData: IndustryIdParamDTO = req.params
  //     let result = await this.DalleService.delete(paramsData.industryId)
  //     new SuccessResponse('Deleted successfully', result).send(res);
  //   }
  //   )
}
