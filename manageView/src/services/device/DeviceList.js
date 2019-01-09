import { stringify } from 'qs';
import request from '@/utils/request';
import '@/pages/config'
import moment from 'moment';

export async function getAllTerminalsImp() {
  // 终端
  return request(`${global.constants.onlineWeb}/terminal/listTerminal`,{
    method: 'GET',
  });
}

export async function addTerminalImp(params) {
  return request(`${global.constants.onlineWeb}/terminal/addTerminal`,{
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateTerminalImp(params) {
  return request(`${global.constants.onlineWeb}/terminal/modifyTerminal`,{
    method: 'PUT',
    body: {
      ...params,
    },
  });
}


// 传感器
export async function getAllSensorsImp() {
  return request(`${global.constants.onlineWeb}/sensor/listSensor`,{
    method: 'GET',
  });
}

export async function addSensorImp(params) {
  return request(`${global.constants.onlineWeb}/sensor/addSensor`,{
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 设备绑定
export async function getAllDeviceConfigsImp() {
  return request(`${global.constants.onlineWeb}/deviceConfig/listDeviceConfig`,{
    method: 'GET',
  });
}

export async function addDeviceConfigImp(params) {
  return request(`${global.constants.onlineWeb}/deviceConfig/addDeviceConfig`,{
    method: 'POST',
    body: {
      ...params,
    },
  });
}