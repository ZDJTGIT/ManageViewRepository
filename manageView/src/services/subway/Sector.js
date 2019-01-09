import request from '@/utils/request';
import '@/pages/config'

export async function getSectorsImp(){
  return request(`${global.constants.onlineWeb}/subway/getSectors`,{
    method: 'GET',
  })
}

export async function addSectorImp(params){
  return request(`${global.constants.onlineWeb}/subway/addSector`,{
    method: 'POST',
    body:{
      ...params,
      sectorBeginTime: params.sectorTime[0].format('YYYY-MM-DD HH:mm:ss'),
      sectorEndTime: params.sectorTime[1].format('YYYY-MM-DD HH:mm:ss'),
    }
  })
}

export async function updateSectorImp(params){
  return request(`${global.constants.onlineWeb}/subway/updateSector`,{
    method: 'POST',
    body:{
      ...params,
      sectorBeginTime: params.sectorBeginTime.format('YYYY-MM-DD HH:mm:ss'),
      sectorEndTime: params.sectorEndTime.format('YYYY-MM-DD HH:mm:ss'),
    }
  })
}
