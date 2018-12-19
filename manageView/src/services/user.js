import request from '@/utils/request';
import '@/pages/config';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request(`${global.constants.onlineWeb}/auth/currentUser`)
    // method: 'GET',
    // header: {
    //   "token": localStorage.getItem('token'),
    // }
  // });          
  // return request('/api/currentUser');
}
