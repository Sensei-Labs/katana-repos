import axios from 'axios';
import { APP_CMS_TOKEN, APP_CMS_URL } from '../env';

const cmsInstance = axios.create({
  baseURL: `${APP_CMS_URL}/api`,
  headers: {
    Authorization: `Bearer ${APP_CMS_TOKEN}`,
  },
});

export default cmsInstance;
