import axios from 'axios';
import SolscanApiKeyStore from '../stores/solscanApiKey';

export const fetchInstance = axios.create({
  baseURL: process.env.APP_SERVER_URL,
  headers: {
    'Accept-Control-Allow-Origin': '*'
  }
});

export type ResponseSolscanTransaction<T = any> = {
  data: T[];
  total?: number;
};

const apiKeyServer = new SolscanApiKeyStore();

export const fetchSolscanInstance = axios.create({
  headers: {
    token: apiKeyServer.init(),
    'Accept-Encoding': 'gzip,deflate,compress'
  }
});

fetchSolscanInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;
    if (error.response) {
      const { status } = error.response || {};

      if (status === 429) {
        console.log('****** Change key in solscan fetch with other key ******');
        const newKey = await apiKeyServer.next();

        config.headers = {
          ...config.headers,
          token: newKey
        };

        console.log('----- Change to new Key Solscan ----- ', newKey);
        return axios(config);
      }
    }
  }
);

export const fetchMagicEdenInstance = axios.create({
  baseURL: process.env.APP_MAGIC_EDEN_API
});

export const fetchSplTokensInstance = axios.create({
  baseURL: process.env.APP_SPL_TOKENS_API
});

export const discordApi = axios.create({
  baseURL: process.env.APP_DISCORD_API
});

export const twitterApi = axios.create({
  baseURL: process.env.APP_Twitter_API
});
