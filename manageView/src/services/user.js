import request from '@/utils/request';
import '@/pages/config';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request(`${global.constants.onlineWeb}/user/getCurrentUser`)
  // });          
  // return request('/api/currentUser');
}
