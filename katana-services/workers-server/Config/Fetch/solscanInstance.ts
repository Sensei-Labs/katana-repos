import axios, { AxiosInstance } from 'axios';
import { APP_SOLSCAN_API_KEYS } from '../env';
import { waitTime } from '../../Utils/waitTime';

const solscanInstance: AxiosInstance = axios.create({
  baseURL: 'https://public-api.solscan.io',
  headers: {
    'Accept-Encoding': 'gzip,deflate,compress',
  },
});

const getSolscanInstance = () => {
  let index: number = 0;
  let token: string = APP_SOLSCAN_API_KEYS[index];

  solscanInstance.defaults.headers.common.token = token;

  solscanInstance.interceptors.response.use(
    (response) => response,
    // eslint-disable-next-line consistent-return
    async (error) => {
      const config = error?.config;
      if (error.response) {
        const { status } = error.response || {};

        if (status >= 300) {
          console.log(error.response);
        }
        if (status === 429) {
          console.log('****** Change key in solscan fetch with other key ******');

          let newIndex = index + 1;
          if (newIndex >= APP_SOLSCAN_API_KEYS.length) {
            newIndex = 0;
            console.log('Waiting 30s for next request...');
            await waitTime(30);
          }

          index = newIndex;
          token = APP_SOLSCAN_API_KEYS[index];

          config.headers = {
            ...config.headers,
            token,
          };

          solscanInstance.defaults.headers.common.token = token;
          return solscanInstance.request(error.config);
        }
      }
    },
  );
};

getSolscanInstance();

export default solscanInstance;
