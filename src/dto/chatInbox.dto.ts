import { ObjectId } from '../../constants';
import { Schema } from 'mongoose';

export class Attachments {
  attachments: [
    {
      url: Schema.Types.String,
      type: Schema.Types.String
    }
  ]
}

// DTO for the entire MongoDB schema
export class ChatInboxDTO {
  _id: Schema.Types.ObjectId = new ObjectId('')
  businessId: Schema.Types.ObjectId;
  to: Schema.Types.ObjectId;
  from: Schema.Types.ObjectId;
  attachments: any[];
  groupId: Schema.Types.ObjectId;
  chatId: Schema.Types.ObjectId;
  isDeleted: boolean;
}