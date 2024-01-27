import {ICollection} from '../../Modules/Collection/Models/Collection.model';

export interface FetchInterface<T = any> {
  get(): Promise<T>;
}

export interface WorkerInterface<DBType = any, NotDBType = any> {
  init(): Promise<void>;

  getItemsForSave(): Promise<{
    news: NotDBType[];
    updates: DBType[];
    removes: DBType[];
  }>;

  serialize(payload: NotDBType[]): DBType[];

  createItem(payload: DBType): Promise<DBType>;

  updateItem(projectId: string, payload: DBType): Promise<DBType>;
}

export interface CMSProjectsInterface {
  id: string;
  name: string;
  thumbnail?: {
    url: string;
  };
  tokens?: any[];
  collection_nfts_addresses?: ICollection[];
  treasuryAddresses?: {
    label: string;
    address: string;
  }[];
}
