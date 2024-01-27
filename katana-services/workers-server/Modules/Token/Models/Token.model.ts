import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface IToken {
  owner: string;
  mintAddress: string;
  model: 'sft' | 'nft';
  collectionAddress?: string;
  name?: string;
  symbol?: string;
  image?: string;
  amount?: number;
  price?: number;
  priceUsd?: number;
  priceSol?: number;
  updatedAt: Date;
}

export type ITokenModel = IToken & mongoose.Document;

const tokenSchema = new Schema<ITokenModel>(
  {
    mintAddress: {
      type: String,
      required: true,
      unique: false,
    },
    collectionAddress: {
      type: String,
      default: '',
    },
    owner: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    symbol: {
      type: String,
      default: '',
    },
    model: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    priceUsd: {
      type: Number,
      default: 0,
    },
    priceSol: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const modelName = 'token';

const TokenModel = mongoose.model<ITokenModel>(modelName, tokenSchema);

export default TokenModel;
