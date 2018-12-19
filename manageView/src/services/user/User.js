import request from '@/utils/request';
import '@/pages/config'

export async function getUsersImp(){
  return request(`${global.constants.onlineWeb}/user/getUsers`,{
    method: 'GET',
    // body:{
    //   ...params.projectInfo,
    //   ...params.values,
    //   sectorBeginTime:params.projectInfo.sectorTime[0].format('YYYY-MM-DD HH:mm:ss'),
    //   sectorEndTime:params.projectInfo.sectorTime[1].format('YYYY-MM-DD HH:mm:ss'),
    // }
  })
}

export async function addUserImp(params){
  return request(`${global.constants.onlineWeb}/user/addUser`,{
    method: 'POST',
    body:{
      ...params,
    }
  })
}

export async function updateUserImp(params){
  return request(`${global.constants.onlineWeb}/user/updateUser`,{
    method: 'POST',
    body:{
      ...params,
    },
  })
}

export async function deleteUserImp(params){
  return request(`${global.constants.onlineWeb}/user/deleteUser`,{
    method: 'POST',
    body:{
      ...params,
    },
  })
}