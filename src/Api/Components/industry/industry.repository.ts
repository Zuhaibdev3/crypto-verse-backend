import Industry, { IndustryModal } from './industry.entity';
import IIndustryRepository from './iindustry.repository';
import Repository from '../../../repository/repository';
import { injectable } from 'inversify';
import { DatabaseId } from '../../../../types';


@injectable()
export default class IndustryRepository extends Repository<Industry> implements IIndustryRepository {
  model = IndustryModal
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
