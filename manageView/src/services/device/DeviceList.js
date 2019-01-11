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

export async function deleteTerminalImp(params) {
  return request(`${global.constants.onlineWeb}/terminal/removeTerminal`,{
    method: 'DELETE',
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

export async function updateSensorImp(params) {
  return request(`${global.constants.onlineWeb}/sensor/modifySensor`,{
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteSensorImp(params) {
  return request(`${global.constants.onlineWeb}/sensor/removeSensor`,{
    method: 'DELETE',
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

export async function updateDeviceConfigImp(params) {
  return request(`${global.constants.onlineWeb}/deviceConfig/modifyDeviceConfig`,{
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteDeviceConfigImp(params) {
  return request(`${global.constants.onlineWeb}/deviceConfig/removeDeviceConfig`,{
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}