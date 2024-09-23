import mongoose, { model, Schema, Document } from 'mongoose';
import { ObjectId } from '../../../../constants';
import { USER_COLLECTION_NAME, User } from '../user/user.entity';
import { BaseSuperAdminModel } from '../../common/common.entity';
import { SuperAdminEntityDTO } from '../../../dto/common.dto';

export const INDUSTRY_DOCUMENT_NAME = 'Industry';
export const INDUSTRY_COLLECTION_NAME = 'industry';

export default class Industry extends SuperAdminEntityDTO implements IIndustry {
  name: string = ""; // Only the "name" field is included
  businessId: Schema.Types.ObjectId | null = new ObjectId(" ")
}

export interface IIndustry extends SuperAdminEntityDTO {
  name: string;
  businessId: Schema.Types.ObjectId | null
}

const schema = new Schema<IIndustry>(
  {
    name: {
      type: String,
      required: true
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME
    }
  },
);

schema.add(BaseSuperAdminModel)


export const IndustryModal = model<IIndustry>(INDUSTRY_DOCUMENT_NAME, schema, INDUSTRY_COLLECTION_NAME);