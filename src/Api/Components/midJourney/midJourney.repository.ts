import Industry, { MidJourneyModal } from './midJourney.entity';
import Repository from '../../../repository/repository';
import { injectable } from 'inversify';
import { DatabaseId } from '../../../../types';
import IMidJourneyRepository from './imidJourney.repository';


@injectable()
export default class MidJourneyRepository extends Repository<Industry> implements IMidJourneyRepository {
  model = MidJourneyModal
  // async getIndustrysByBusinessId(businessId: DatabaseId, page: number, limit: number): Promise<any> {
  //   const [industry, total] = await Promise.all([
  //     this.findAllWithPopulateAndPagination({ businessId }, 'jobId applicantId salaryRateId', page, limit),
  //     this.count({ businessId }),
  //   ]);
  //   return {
  //     industry,
  //     total,
  //   };
  // }
  // async getIndustryById(Id:DatabaseId,businessId:DatabaseId): Promise<any> {
  //   return await this.findOneWithPopulate({ _id:Id,businessId }, 'jobId applicantId salaryRateId')
  // }
}
