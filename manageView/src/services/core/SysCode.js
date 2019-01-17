import { stringify } from 'qs';
import request from '@/utils/request';
import '@/pages/config'
import moment from 'moment';

export async function getAllParserMethodsImp() {
  // 终端
  return request(`${global.constants.onlineWeb}/sysCode/listParserMethod`,{
    method: 'GET',
  });
}