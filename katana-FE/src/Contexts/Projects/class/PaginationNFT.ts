import { NFTTokenType } from '@/types/nft';

const LIMIT = 8;

export default class PaginationNFT {
  public _page: number = 1;
  public _docs: NFTTokenType[] = [];
  public _countTokens: number = 0;
  private readonly _nftList: NFTTokenType[];

  constructor(nftList: NFTTokenType[]) {
    this._nftList = nftList;
    this._countTokens = nftList.length;
  }

  fetchData(startCount: number, endCount: number) {
    const list = this._nftList;
    const newTokens = list.slice(startCount, endCount);
    this._docs = [...this._docs, ...newTokens];
    return this._docs;
  }

  init() {
    const list = this._nftList;
    this._docs = list.slice(0, LIMIT);
    return this._docs;
  }

  onNext() {
    const startCount = this._page * LIMIT;
    const newPage = this._page + 1;
    this._page = newPage;

    const endCount = newPage * LIMIT;
    return this.fetchData(startCount, endCount);
  }

  onPrev() {
    this._page = this._page - 1;
  }

  get isValidNext() {
    const countFetchers = this._page * LIMIT;
    return countFetchers <= this._countTokens;
  }

  get isValidPrev() {
    return this._page > 1;
  }

  get page() {
    return this._page;
  }

  get docs() {
    return this._docs;
  }

  get totalCount() {
    return this._countTokens;
  }
}
