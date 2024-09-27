import { DataCopier } from "../../../utils/dataCopier";
import Industry from './dalle.entity';
import { IDalleService } from './idalle.service';
import { inject, injectable } from 'inversify';
import IDalleRepository from './idalle.repository';
import { BadRequestError } from '../../../core/ApiError';
import SERVICE_IDENTIFIER from '../../../identifiers';
import { UpdateIndustryPayloadDTO } from "../../../Interface/payloadInterface";
import { DallePayloadDTO } from "../../../Interface/payloadInterface";
import { DatabaseId } from "../../../../types";
import { SuperAdminMetaDataDTO } from "../../../dto/index.dto";
import { PaginationDataDTO } from "../../../dto/common.dto";
import { OpenAI } from 'openai';  // Updated import

@injectable()
export class DalleService implements IDalleService {
  private openai: OpenAI;


  constructor(
    @inject(SERVICE_IDENTIFIER.DalleRepository)
    private DalleRepository: IDalleRepository,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_AUTHKEY,
    });
  }

  async add(bodyData: DallePayloadDTO): Promise<Industry> {
    try {
      return await this.openai.images.generate({ prompt: bodyData?.prompt, n: 1, quality: "hd", model: "dall-e-3", style: "natural", size: '1024x1024', });
    } catch (error) {
      throw new BadRequestError('Failed to generate image')
    }
  }

  async getAll(userId: DatabaseId, paginationData: PaginationDataDTO): Promise<any> {
    try {
      return this.DalleRepository.findAllWithPagination({ $or: [{ userId: userId }, { userId: null }] }, paginationData.page, paginationData.limit)
    } catch (error) {
      throw new BadRequestError('No industry found')
    }
  }

  async getAllforAdmin(paginationData: PaginationDataDTO): Promise<any> {
    try {
      return this.DalleRepository.findAllWithPagination({}, paginationData.page, paginationData.limit)
    } catch (error) {
      throw new BadRequestError('No industry found')
    }
  }

  async get(industryId: string): Promise<Industry | null> {
    try {
      return this.DalleRepository.findById(industryId)
    } catch (error) {
      throw new BadRequestError('No industry found')
    }
  }


  async update(bodyData: UpdateIndustryPayloadDTO, metaData: SuperAdminMetaDataDTO, industryId: string): Promise<any> {

    let industryData = DataCopier.assignToTarget(bodyData, metaData)
    const industryUpdateData = DataCopier.copy(Industry, industryData)

    let result!: any
    try {
      result = await this.DalleRepository.updateOne({ _id: industryId }, industryUpdateData)
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