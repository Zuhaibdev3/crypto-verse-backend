import mongoose, { model, Schema, Document } from 'mongoose';
import { USER_COLLECTION_NAME } from '../user/user.entity';
import { ObjectId } from '../../../../constants';
import { NFT_STATUS } from '../../../enums/enums';

export const DALLE_DOCUMENT_NAME = 'dalle';
export const DALLE_COLLECTION_NAME = 'Dalle';

interface INFT {
  url: string;
  description: string;
  status: NFT_STATUS.GENERATED | NFT_STATUS.MINTED | NFT_STATUS.FAVORITES
}
export default class Dalle implements IDalle {
  prompt: string = ""
  nft: INFT[] = [];
  userId: Schema.Types.ObjectId | null = new ObjectId(" ")

}

export interface IDalle {
  prompt: string
  nft: INFT[];
  userId: Schema.Types.ObjectId | null
}

const schema = new Schema<IDalle>(
  {
    prompt: {
      type: String,
      required: true
    },
    nft: {
      type: [{
        url: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        status: {
          type: String,
          enum: [NFT_STATUS.GENERATED, NFT_STATUS.MINTED, NFT_STATUS.FAVORITES],
          default: NFT_STATUS.GENERATED,
          required: true,
        },
      }],
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME
    }
  },
  {
    strict: false,
    versionKey: false,
    timestamps: true
  }
);



export const DalleModal = model<IDalle>(DALLE_DOCUMENT_NAME, schema, DALLE_COLLECTION_NAME);