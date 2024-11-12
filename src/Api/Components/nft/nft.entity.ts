import { model, Schema, } from 'mongoose';
import { ObjectId } from '../../../../constants';
import { USER_COLLECTION_NAME, User } from '../user/user.entity';
import { NFT_STATUS } from '../../../enums/enums';
import { enumMapper } from '../../../utils/enumMapper';
import { number } from 'joi';

export const NFT_DOCUMENT_NAME = 'Nft';
export const NFT_COLLECTION_NAME = 'nft';

export default class Nft implements INft {
  prompt: string = "";
  walletAddress: string = "";
  url: string = "";
  userId: Schema.Types.ObjectId | null = new ObjectId(" ")
  status: NFT_STATUS.GENERATED | NFT_STATUS.MINTED | NFT_STATUS.FAVORITES = NFT_STATUS.GENERATED
  likes: number = 0
  views: number = 0
}

export interface INft {
  prompt: string;
  walletAddress: string;
  url: string;
  userId: Schema.Types.ObjectId | null
  status: NFT_STATUS.GENERATED | NFT_STATUS.MINTED | NFT_STATUS.FAVORITES
  likes: number
  views: number
}

const schema = new Schema<INft>(
  {
    prompt: {
      type: String,
      required: true
    },
    walletAddress: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: [...enumMapper(NFT_STATUS)],
      required: true
    },
    likes: {
      type: Number,
      required: false
    },
    views: {
      type: Number,
      required: false
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME
    }
  },
);

export const NftModal = model<INft>(NFT_DOCUMENT_NAME, schema, NFT_COLLECTION_NAME);