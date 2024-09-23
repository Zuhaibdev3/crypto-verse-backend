import Industries from "./industry.entity";
import IRepository from '../../../repository/irepository';
import { Schema } from 'mongoose';
import { DatabaseId } from "../../../../types";


export default interface IIndustriesRepository extends IRepository<Industries> {
  // getIndustriessByBusinessId(businessId: DatabaseId, page: number, limit: number): Promise<any>
  // getIndustriesById(Id:DatabaseId,businessId:DatabaseId): Promise<any>
}