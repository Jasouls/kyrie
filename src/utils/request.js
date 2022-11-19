import axios from 'axios';
import router from '@/router';
import store from '@/store';
import { getLoginStatus } from '@/utils/auth';

const service = axios.create({
  baseURL: '', // api的_url
  timeout: 1000 * 60 * 5, // request timeout
});

service.interceptors.request.use(config => config,
  (reason) => {
    Promise.reject(reason);
  });

service.interceptors.response.use((res) => {
  if (!getLoginStatus() && router.currentRoute.name !== 'login') {
    store.dispatch('UserLogout').then(() => {
      router.push({ name: 'login' });
    });
  }
  return res;
}, (err) => {
  console.log(err);
  if (err.response.status === 401 || err.response.status === 504) {
    store.dispatch('UserLogout').then(() => {
      router.push({ name: 'login' });
    });
  }
  return Promise.reject(err);
});

export default service;