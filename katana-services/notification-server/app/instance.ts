import axios from 'axios';

const instance = axios.create({
  baseURL: `${process.env.APP_API_URL || 'http://localhost:1337'}`,
});

export default instance;
