import Dalle, { DalleModal } from './dalle.entity';
import Repository from '../../../repository/repository';
import { injectable } from 'inversify';
import { DatabaseId } from '../../../../types';
import IDalleRepository from './idalle.repository';


@injectable()
export default class DalleRepository extends Repository<Dalle> implements IDalleRepository {
  model = DalleModal
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
