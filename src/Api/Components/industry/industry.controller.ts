import { Response, NextFunction } from "express"
import asyncHandler from "../../../helpers/async";
import { SuccessResponse } from '../../../core/ApiResponse';
import _ from 'lodash';
import { IIndustryService } from './iindustry.service';
import { resolve } from "../../../dependencymanagement"
import SERVICE_IDENTIFIER from "../../../identifiers";
import { IndustryIdParamDTO, IndustryPayloadDTO, UpdateIndustryPayloadDTO } from "../../../Interface/payloadInterface";
import { tokenDataParser } from "../../../utils/tokenDataParser";
import { AdminMetaDataDTO, SuperAdminMetaDataDTO } from "../../../dto/index.dto";
import { paginationParser } from "../../../utils/paginationParser";
import { PaginationDataDTO } from "../../../dto/common.dto";


export class IndustryController {

  getIndustryService(): IIndustryService {
    return resolve<IIndustryService>(SERVICE_IDENTIFIER.IndustryService);
  }

  industryService = this.getIndustryService();

  add =
    asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      let bodyData: IndustryPayloadDTO = req.body
      const adminMetaData: AdminMetaDataDTO = tokenDataParser.getUserTokenMetaData(req.user)
      let result = await this.industryService.add(bodyData, adminMetaData)
      new SuccessResponse('Industry added successfully', result).send(res);
    })

  getAll =
    asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const paginationData: PaginationDataDTO = paginationParser.getpaginationData(req.query)
      let { _id: userId } = req.user
      let result = await this.industryService.getAll(userId, paginationData)
      new SuccessResponse('found industry successfully', result).send(res);
    })
    getAllforAdmin =
    asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const paginationData: PaginationDataDTO = paginationParser.getpaginationData(req.query)
      let { _id: userId } = req.user
      let result = await this.industryService.getAllforAdmin(paginationData)
      new SuccessResponse('All found industry successfully', result).send(res);
    })
  get =
    asyncHandler(async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const paramsData: IndustryIdParamDTO = req.params
      let result = await this.industryService.get(paramsData.industryId)
      new SuccessResponse('found industry successfully', result).send(res);
    })

  update =
    asyncHandler(async (req: any, res: Response): Promise<Response | void> => {
      let bodyData: UpdateIndustryPayloadDTO = req.body
      const paramsData: IndustryIdParamDTO = req.params
      const metaData: SuperAdminMetaDataDTO = tokenDataParser.getSuperAdminTokenMetaData(req.user)
      let result = await this.industryService.update(bodyData, metaData, paramsData.industryId)
      new SuccessResponse('Updated successfully', result).send(res);
    })



  delete =
    asyncHandler(async (req: any, res: Response): Promise<Response | void> => {
      const paramsData: IndustryIdParamDTO = req.params
      let result = await this.industryService.delete(paramsData.industryId)
      new SuccessResponse('Deleted successfully', result).send(res);
    }
    )
}
