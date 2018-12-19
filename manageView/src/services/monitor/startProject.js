import { stringify } from 'qs';
import request from '@/utils/request';
import '@/pages/config'
import moment from 'moment';

export async function getAddSectorBaseImp() {
  return request(`${global.constants.onlineWeb}/sector/getAddSectorBase`,{
    method: 'GET',
  });
}

export async function addProjectImp(params){
  return request(`${global.constants.onlineWeb}/sector/addSector`,{
    method: 'POST',
    body:{
      ...params.projectInfo,
      ...params.values,
      sectorBeginTime:params.projectInfo.sectorTime[0].format('YYYY-MM-DD HH:mm:ss'),
      sectorEndTime:params.projectInfo.sectorTime[1].format('YYYY-MM-DD HH:mm:ss'),
    }
  })
}