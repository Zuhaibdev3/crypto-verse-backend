import { Response, NextFunction } from "express"
import asyncHandler from "../../../helpers/async";
import { SuccessResponse } from '../../../core/ApiResponse';
import _ from 'lodash';
import { IDalleService } from './idalle.service';
import { resolve } from "../../../dependencymanagement"
import SERVICE_IDENTIFIER from "../../../identifiers";
import { IndustryIdParamDTO, UpdateIndustryPayloadDTO } from "../../../Interface/payloadInterface";
import { DallePayloadDTO } from "../../../Interface/payloadInterface";
import { tokenDataParser } from "../../../utils/tokenDataParser";
import { AdminMetaDataDTO, SuperAdminMetaDataDTO } from "../../../dto/index.dto";
import { paginationParser } from "../../../utils/paginationParser";
import { PaginationDataDTO } from "../../../dto/common.dto";


export class DalleController {

  getDalleService(): IDalleService {
    return resolve<IDalleService>(SERVICE_IDENTIFIER.DalleService);
  }

  DalleService = this.getDalleService();

  generateImage =
    asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      let bodyData: DallePayloadDTO = req.body
      // const adminMetaData: AdminMetaDataDTO = tokenDataParser.getUserTokenMetaData(req.user)
      let result = await this.DalleService.add(bodyData)
      new SuccessResponse('image generated successfully', result).send(res);
    })

  getAll =
    asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const paginationData: PaginationDataDTO = paginationParser.getpaginationData(req.query)
      let { _id: userId } = req.user
      let result = await this.DalleService.getAll(userId, paginationData)
      new SuccessResponse('found industry successfully', result).send(res);
    })
  getAllforAdmin =
    asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const paginationData: PaginationDataDTO = paginationParser.getpaginationData(req.query)
      let { _id: userId } = req.user
      let result = await this.DalleService.getAllforAdmin(paginationData)
      new SuccessResponse('All found industry successfully', result).send(res);
    })
  get =
    asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const paramsData: IndustryIdParamDTO = req.params
      let result = await this.DalleService.get(paramsData.industryId)
      new SuccessResponse('found industry successfully', result).send(res);
    })

  update =
    asyncHandler(async (req: any, res: Response): Promise<Response | void> => {
      let bodyData: UpdateIndustryPayloadDTO = req.body
      const paramsData: IndustryIdParamDTO = req.params
      const metaData: SuperAdminMetaDataDTO = tokenDataParser.getSuperAdminTokenMetaData(req.user)
      let result = await this.DalleService.update(bodyData, metaData, paramsData.industryId)
      new SuccessResponse('Updated successfully', result).send(res);
    })



  delete =
    asyncHandler(async (req: any, res: Response): Promise<Response | void> => {
      const paramsData: IndustryIdParamDTO = req.params
      let result = await this.DalleService.delete(paramsData.industryId)
      new SuccessResponse('Deleted successfully', result).send(res);
    }
    )
}
