import IRepository from '../../../repository/irepository';
import { Schema } from 'mongoose';
import { DatabaseId } from "../../../../types";
import Dalle from "./stabilityai.entity";
import Stabilityai from './stabilityai.entity';


export default interface StabilityaiRepository extends IRepository<Stabilityai> {
  // getIndustriessByBusinessId(businessId: DatabaseId, page: number, limit: number): Promise<any>
  // getIndustriesById(Id:DatabaseId,businessId:DatabaseId): Promise<any>
}