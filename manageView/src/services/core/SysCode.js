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

export async function getAllMonitorTypeImp() {
  // 终端
  return request(`${global.constants.onlineWeb}/sysCode/listMonitorType`,{
    method: 'GET',
  });
}
