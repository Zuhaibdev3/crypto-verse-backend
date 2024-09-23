import { ObjectId } from "../../../constants";
import { RoleCode } from "../../database/model/Role";
import { Schema } from 'mongoose';


export class generateTokenDataDTO {
  userId: Schema.Types.ObjectId = new ObjectId('');
  businessId: Schema.Types.ObjectId = new ObjectId('');
  email: string = "";
}