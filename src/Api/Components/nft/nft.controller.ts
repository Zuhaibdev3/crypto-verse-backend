import { Response, NextFunction } from "express"
import asyncHandler from "../../../helpers/async";
import { SuccessResponse } from '../../../core/ApiResponse';
import _ from 'lodash';
import { INftService } from './inft.service';
import { resolve } from "../../../dependencymanagement"
import SERVICE_IDENTIFIER from "../../../identifiers";
import { IndustryIdParamDTO, IndustryPayloadDTO, NftLikePayloadDTO, UpdateIndustryPayloadDTO } from "../../../Interface/payloadInterface";
import { tokenDataParser } from "../../../utils/tokenDataParser";
import { AdminMetaDataDTO, SuperAdminMetaDataDTO, UserMetaDataDTO } from "../../../dto/index.dto";
import { paginationParser } from "../../../utils/paginationParser";
import { PaginationDataDTO } from "../../../dto/common.dto";


export class NftController {

  getNftService(): INftService {
    return resolve<INftService>(SERVICE_IDENTIFIER.NftService);
  }

  NftService = this.getNftService();
  // ImageToImageGeneration = asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
  //   let { _id: userId, walletAddress } = req.user
  //   console.log(userId, "userId")
  //   const result = await this.StabilityaiService.ImageToImageGeneration(req, res, userId, walletAddress);
  //   new SuccessResponse('image generated successfully', result).send(res);
  // })
  // add =
  //   asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
  //     let bodyData: IndustryPayloadDTO = req.body
  //     const adminMetaData: AdminMetaDataDTO = tokenDataParser.getUserTokenMetaData(req.user)
  //     let result = await this.NftService.add(bodyData, adminMetaData)
  //     new SuccessResponse('Industry added successfully', result).send(res);
  //   })

  getAll = asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
    const paginationData: PaginationDataDTO = paginationParser.getpaginationData(req.query)
    let { walletAddress } = req.user
    let result = await this.NftService.getAll(walletAddress, paginationData)
    new SuccessResponse('found nfts successfully', result).send(res);
  })

  updateLike =
    asyncHandler(async (req: any, res: Response): Promise<Response | void> => {
      let bodyData: NftLikePayloadDTO = req.body
      const { _id } = req.params
      const metaData: UserMetaDataDTO = tokenDataParser.getUserTokenMetaData(req.user)
      let result = await this.NftService.handleLikeReaction(bodyData, metaData, _id)
      new SuccessResponse('Updated successfully', result).send(res);
    })

  getById =
    asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const { _id } = req.params
      let result = await this.NftService.get(_id)
      new SuccessResponse('found industry successfully', result).send(res);
    })

  update =
    asyncHandler(async (req: any, res: Response): Promise<Response | void> => {
      let bodyData: any = req.body
      const { _id } = req.params
      const metaData: UserMetaDataDTO = tokenDataParser.getUserTokenMetaData(req.user)
      let result = await this.NftService.update(bodyData, metaData, _id)
      new SuccessResponse('Updated successfully', result).send(res);
    })

  // getAllforAdmin =
  //   asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
  //     const paginationData: PaginationDataDTO = paginationParser.getpaginationData(req.query)
  //     let { _id: userId } = req.user
  //     let result = await this.industryService.getAllforAdmin(paginationData)
  //     new SuccessResponse('All found industry successfully', result).send(res);
  //   })
  // get =
  //   asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
  //     const paramsData: IndustryIdParamDTO = req.params
  //     let result = await this.industryService.get(paramsData.industryId)
  //     new SuccessResponse('found industry successfully', result).send(res);
  //   })

  // update =
  //   asyncHandler(async (req: any, res: Response): Promise<Response | void> => {
  //     let bodyData: UpdateIndustryPayloadDTO = req.body
  //     const paramsData: IndustryIdParamDTO = req.params
  //     const metaData: SuperAdminMetaDataDTO = tokenDataParser.getSuperAdminTokenMetaData(req.user)
  //     let result = await this.industryService.update(bodyData, metaData, paramsData.industryId)
  //     new SuccessResponse('Updated successfully', result).send(res);
  //   })



  // delete =
  //   asyncHandler(async (req: any, res: Response): Promise<Response | void> => {
  //     const paramsData: IndustryIdParamDTO = req.params
  //     let result = await this.industryService.delete(paramsData.industryId)
  //     new SuccessResponse('Deleted successfully', result).send(res);
  //   }
  //   )
}
