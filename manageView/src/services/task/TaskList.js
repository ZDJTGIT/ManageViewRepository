import { stringify } from 'qs';
import request from '@/utils/request';
import '@/pages/config'
import moment from 'moment';

// 终端
export async function getAllTasksImp() {
  return request(`${global.constants.onlineWeb}/quartz/getAllTask`,{
    method: 'GET',
  });
}

export async function addTaskImp(params) {
  return request(`${global.constants.onlineWeb}/quartz/addTask`,{
    method: 'POST',
    body:{
      ...params,
    },
  });
}

export async function addSimpleTaskImp(params) {
  return request(`${global.constants.onlineWeb}/quartz/createSimpleTask`,{
    method: 'POST',
    body:{
      ...params,
    },
  });
}

export async function deleteTaskImp(params) {
  return request(`${global.constants.onlineWeb}/quartz/deleteTask`,{
    method: 'DELETE',
    body: {
      "taskName":params.taskName,
    },
  });
}

export async function updateTaskImp(params) {
  return request(`${global.constants.onlineWeb}/quartz/updateCronTask`,{
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}