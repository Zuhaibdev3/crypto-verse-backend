import { ObjectId } from '../../constants';
import { Schema } from 'mongoose';

// DTO for the entire MongoDB schema
export class GroupChatDTO {
  _id: Schema.Types.ObjectId = new ObjectId('')
  businessId: Schema.Types.ObjectId;
  groupName: string;
  participants: any[];
  groupAdmins: any[];
  type: string;
  associateWorkspace: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  isPrivate: boolean;
  isDeleted: boolean;
}