// import {BASE_URL} from '@env';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import Storage from '../stroage';

export const instance = axios.create({
  baseURL: process.env.BASE_URL,
  // baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshToken = async () => {
  const refreshToken = Storage.getItem('refresh-token');

  if (!refreshToken) {
    return null;
  }

  console.log('Refresh Token ...........');

  // Uncomment and implement token refresh logic as needed
  // try {
  //   const response = await axios.post('https://dummyjson.com/auth/refresh', {
  //     refreshToken: refreshToken,
  //   });
  //   return response.data.refreshToken;
  // } catch (error: any) {
  //   console.log(error.response.data);
  //   throw error;
  // }
};

instance.interceptors.request.use(async config => {
  const state = await NetInfo.fetch();

  if (!state.isConnected) {
    throw new axios.Cancel(
      'No internet connection. Please connect to the internet.',
    );
  }

  const token = Storage.getItem('token');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        instance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
