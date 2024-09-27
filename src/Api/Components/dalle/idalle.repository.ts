import IRepository from '../../../repository/irepository';
import { Schema } from 'mongoose';
import { DatabaseId } from "../../../../types";
import Dalle from "./dalle.entity";


export default interface DalleRepository extends IRepository<Dalle> {
  // getIndustriessByBusinessId(businessId: DatabaseId, page: number, limit: number): Promise<any>
  // getIndustriesById(Id:DatabaseId,businessId:DatabaseId): Promise<any>
}