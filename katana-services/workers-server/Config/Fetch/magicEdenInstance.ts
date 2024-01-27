import axios from 'axios';

const magicEdenInstance = axios.create({
  baseURL: 'https://api-mainnet.magiceden.dev/v2',
});

export default magicEdenInstance;
