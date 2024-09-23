import { ObjectId } from '../../constants';
import { Schema } from 'mongoose';

// DTO for the entire MongoDB schema
export class ChatActivityDTO {
  _id: Schema.Types.ObjectId = new ObjectId('')
  chatId: Schema.Types.ObjectId;
  type: string;
  userId: Schema.Types.ObjectId;
  businessId: Schema.Types.ObjectId;
  isDeleted: boolean;
  emotion: string;
  groupId: Schema.Types.ObjectId;
}