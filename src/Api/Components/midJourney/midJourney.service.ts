import { DataCopier } from "../../../utils/dataCopier";
import Industry from './midJourney.entity';
import { IMidJourneyService } from './imidJourney.service';
import { inject, injectable } from 'inversify';
import IMidJourneyRepository from './imidJourney.repository';
import { BadRequestError } from '../../../core/ApiError';
import SERVICE_IDENTIFIER from '../../../identifiers';
import { UpdateIndustryPayloadDTO } from "../../../Interface/payloadInterface";
import { MidJourneyPayloadDTO } from "../../../Interface/payloadInterface";
import { DatabaseId } from "../../../../types";
import { SuperAdminMetaDataDTO } from "../../../dto/index.dto";
import { PaginationDataDTO } from "../../../dto/common.dto";
import { OpenAI } from 'openai';  // Updated import

@injectable()
export class MidJourneyService implements IMidJourneyService {
  private openai: OpenAI;


  constructor(
    @inject(SERVICE_IDENTIFIER.MidJourneyRepository)
    private MidJourneyRepository: IMidJourneyRepository,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_AUTHKEY,
    });
  }

  async add(bodyData: MidJourneyPayloadDTO): Promise<Industry> {
    try {
      return await this.openai.images.generate({ prompt: bodyData?.prompt, n: 1, quality: "hd", model: "dall-e-3", style: "natural", size: '1024x1024', });
    } catch (error) {
      throw new BadRequestError('Failed to generate image')
    }
  }

  async getAll(userId: DatabaseId, paginationData: PaginationDataDTO): Promise<any> {
    try {
      return this.MidJourneyRepository.findAllWithPagination({ $or: [{ userId: userId }, { userId: null }] }, paginationData.page, paginationData.limit)
    } catch (error) {
      throw new BadRequestError('No industry found')
    }
  }

  async getAllforAdmin(paginationData: PaginationDataDTO): Promise<any> {
    try {
      return this.MidJourneyRepository.findAllWithPagination({}, paginationData.page, paginationData.limit)
    } catch (error) {
      throw new BadRequestError('No industry found')
    }
  }

  async get(industryId: string): Promise<Industry | null> {
    try {
      return this.MidJourneyRepository.findById(industryId)
    } catch (error) {
      throw new BadRequestError('No industry found')
    }
  }


  async update(bodyData: UpdateIndustryPayloadDTO, metaData: SuperAdminMetaDataDTO, industryId: string): Promise<any> {

    let industryData = DataCopier.assignToTarget(bodyData, metaData)
    const industryUpdateData = DataCopier.copy(Industry, industryData)

    let result!: any
    try {
      result = await this.MidJourneyRepository.updateOne({ _id: industryId }, industryUpdateData)
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