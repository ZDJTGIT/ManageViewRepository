import request from '@/utils/request';
import '@/pages/config'

export async function getProjectsImp(params){
  return request(`${global.constants.onlineWeb}/project/getAllProjects`,{
    method: 'GET',
  });
}

export async function addProjectImp(params){
  return request(`${global.constants.onlineWeb}/project/addProject`,{
    method: 'POST',
    body:{
      ...params,
    },
  });
}

export async function deleteProjectImp(params){
  return request(`${global.constants.onlineWeb}/project/deleteProject`,{
    method: 'POST',
    body:{
      ...params,
    },
  });
}