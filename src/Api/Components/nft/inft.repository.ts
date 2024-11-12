import Nft from "./nft.entity";
import IRepository from '../../../repository/irepository';
import { Schema } from 'mongoose';
import { DatabaseId } from "../../../../types";


export default interface INftRepository extends IRepository<Nft> {
  // getIndustriessByBusinessId(businessId: DatabaseId, page: number, limit: number): Promise<any>
  // getIndustriesById(Id:DatabaseId,businessId:DatabaseId): Promise<any>
}