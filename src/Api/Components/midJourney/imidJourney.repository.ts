import IRepository from '../../../repository/irepository';
import { Schema } from 'mongoose';
import { DatabaseId } from "../../../../types";
import MidJourney from "./midJourney.entity";


export default interface IMidJourneyRepository extends IRepository<MidJourney> {
  // getIndustriessByBusinessId(businessId: DatabaseId, page: number, limit: number): Promise<any>
  // getIndustriesById(Id:DatabaseId,businessId:DatabaseId): Promise<any>
}