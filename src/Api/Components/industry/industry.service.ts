import { DataCopier } from "../../../utils/dataCopier";
import Industry from './industry.entity';
import { IIndustryService } from './iindustry.service';
import { inject, injectable } from 'inversify';
import IIndustryRepository from './iindustry.repository';
import { BadRequestError } from '../../../core/ApiError';
import SERVICE_IDENTIFIER from '../../../identifiers';
import { User } from "../user/user.entity";
import { ObjectId } from "mongoose";
import { IndustryPayloadDTO, UpdateIndustryPayloadDTO } from "../../../Interface/payloadInterface";
import { DatabaseId } from "../../../../types";
import { SuperAdminMetaDataDTO } from "../../../dto/index.dto";
import { PaginationDataDTO } from "../../../dto/common.dto";

@injectable()
export class IndustryService implements IIndustryService {

  constructor(
    @inject(SERVICE_IDENTIFIER.IndustryRepository)
    private industryRepository: IIndustryRepository,
  ) { }

  async add(bodyData: IndustryPayloadDTO, metaData: SuperAdminMetaDataDTO): Promise<Industry> {
    let industryData = DataCopier.assignToTarget(bodyData, metaData)
    const addIndustry = DataCopier.copy(Industry, industryData)
    try {
      return this.industryRepository.create(addIndustry)
    } catch (error) {
      throw new BadRequestError('industry cannot be created')
    }
  }

  async getAll(businessId: DatabaseId, paginationData: PaginationDataDTO): Promise<any> {
    try {
      return this.industryRepository.findAllWithPagination({ $or: [{ businessId: businessId }, { businessId: null }] }, paginationData.page, paginationData.limit)
    } catch (error) {
      throw new BadRequestError('No industry found')
    }
  }

  async get(industryId: string): Promise<Industry | null> {
    try {
      return this.industryRepository.findById(industryId)
    } catch (error) {
      throw new BadRequestError('No industry found')
    }
  }


  async update(bodyData: UpdateIndustryPayloadDTO, metaData: SuperAdminMetaDataDTO, industryId: string): Promise<any> {

    let industryData = DataCopier.assignToTarget(bodyData, metaData)
    const industryUpdateData = DataCopier.copy(Industry, industryData)

    let result!: any
    try {
      result = await this.industryRepository.updateOne({ _id: industryId }, industryUpdateData)
      if (!result) throw new BadRequestError('No industry found')
    } catch (error) {
      throw new BadRequestError('industry cannot be update')
    }
    return result
  }


  async delete(industryId: string): Promise<any> {

    try {
      //@ts-ignore

      return this.industryRepository.delete({ _id: industryId })
      // if (!result) throw new BadRequestError('No industry found')
    } catch (error) {
      console.log('error...', error)
      throw new BadRequestError('industry cannot be delete')
    }
    // return result
  }
}