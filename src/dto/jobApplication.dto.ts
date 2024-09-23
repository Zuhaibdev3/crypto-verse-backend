import { ObjectId } from "../../constants";
import { Date, Schema } from 'mongoose';

export class JobApplicantsDropdownDTO {
  _id :Schema.Types.ObjectId = new ObjectId('')
  applicantName: string = '';
  createdAt : Date

}
