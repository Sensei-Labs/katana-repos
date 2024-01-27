import axios from 'axios';

function getToken() {
  if (typeof window === 'undefined') return '';

  const token = localStorage.getItem('jwtToken');
  return token ? `Bearer ${token.replace(/"/g, '')}` : '';
}

export const fetchInstance = axios.create({
  baseURL: process.env.APP_SERVER_URL,
  headers: {
    Authorization: getToken()
  }
});
