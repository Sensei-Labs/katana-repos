import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface ICollectionInfo {
  solscanId: string;
  magicEdenSymbol: string;
  floor_price?: number;
  holders?: number;
  items?: number;
  last_trade_id?: string;
  last_trade_time?: string;
  nft_image?: string;
  total_attributes?: number;
  volume_24_hours?: number;
  collection_id: string;
  volume?: number;
  volume_all?: number;
  listed?: number;
  collection_name: string;
  nft_family?: string;
  marketplaces?: string[];
}

export interface ICollection {
  name: string;
  cmsID: number;
  address: string;
  solscanID: string;
  collectionOnchainId: string;
  magicEdenSymbol: string;
}

export type ICollectionModel = mongoose.Document & ICollection;

export const collectionSchema = new Schema<ICollectionModel>({
  cmsID: { type: Number },
  name: { type: String },
  address: { type: String },
  solscanID: { type: String },
  collectionOnchainId: { type: String },
  magicEdenSymbol: { type: String },
});
export const schemaCollectionInfo = new Schema<ICollectionInfo>({
  collection_id: { type: String },
  solscanId: { type: String },
  magicEdenSymbol: { type: String },
  floor_price: {
    type: Number,
    default: 0,
  },
  holders: {
    type: Number,
    default: 0,
  },
  items: {
    type: Number,
    default: 0,
  },
  last_trade_id: {
    type: String,
    default: '',
  },
  last_trade_time: {
    type: String,
    default: '',
  },
  collection_name: {
    type: String,
    default: '',
  },
  nft_family: {
    type: String,
    default: '',
  },
  nft_image: {
    type: String,
    default: '',
  },
  total_attributes: {
    type: Number,
    default: 0,
  },
  volume_24_hours: {
    type: Number,
    default: 0,
  },
  listed: {
    type: Number,
    default: 0,
  },
  volume: {
    type: Number,
    default: 0,
  },
  volume_all: {
    type: Number,
    default: 0,
  },
  marketplaces: [
    {
      type: String,
      default: [],
    },
  ],
});
