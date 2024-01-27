import { Cache } from 'cache-manager';

const cacheManager = require('cache-manager');

const ONE_MINUTE = 1000 * 60;
const ONE_DAY = ONE_MINUTE * 60 * 24;

const cacheSolscanApiKeyStore = cacheManager.caching('memory', {
  ttl: ONE_DAY
});

let cacheStore: Cache = null;

const keyInStore = 'active-key';

export default class SolscanApiKeyStore {
  private readonly keys: string[] = [];
  private activeIndex: number = 0;

  constructor() {
    try {
      const keys = JSON.parse(process.env.SOLSCAN_API_KEYS);
      if (Array.isArray(keys)) {
        this.keys = keys;
      }
    } catch (e) {
      console.log(e);
    }
  }

  async initCache() {
    cacheStore = await cacheSolscanApiKeyStore;
  }

  init() {
    return this.keys?.[0] || '';
  }

  async get() {
    const value = await cacheStore.get(keyInStore);

    if (!value) {
      const { keys } = this;
      this.activeIndex = 0;

      if (!keys.length) return '';

      await this.set(keys[0]);
      return keys[0];
    }

    return value || '';
  }

  async set(value: string) {
    await cacheStore.set(keyInStore, value, ONE_DAY);
  }

  async next() {
    const newIndex = this.activeIndex + 1;

    if (newIndex < this.keys.length) {
      this.activeIndex = newIndex;
      console.log(`NEW index to ${newIndex}`);
      await this.set(this.keys[newIndex]);
      return await this.get();
    }

    console.log(`RESET index to 0`);
    this.activeIndex = 0;
    await this.set(this.keys[0]);
    return await this.get();
  }
}
