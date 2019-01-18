import { stringify } from 'qs';
import request from '@/utils/request';
import '@/pages/config'
import moment from 'moment';

// 终端
export async function getAllTerminalsImp() {
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

export async function deleteTerminalsImp(params) {
  const temp = new FormData();
  temp.append("terminalIdList",params)
  return request(`${global.constants.onlineWeb}/terminal/removeTerminals`,{
    method: 'POST',
    body: temp
  });
}

export async function isInUseImp(params) {
  return request(`${global.constants.onlineWeb}/terminal/isInUse?terminalNumber=${params}`,{
    method: 'GET',
  });
}

export async function terminalsInUseImp(params) {
  const temp = new FormData();
  temp.append("terminalIdList",params)
  return request(`${global.constants.onlineWeb}/terminal/terminalsInUse`,{
    method: 'POST',
    body: temp
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

export async function deleteSensorsImp(params) {
  const temp = new FormData();
  temp.append("sensorIdList",params)
  return request(`${global.constants.onlineWeb}/sensor/removeSensors`,{
    method: 'POST',
    body: temp
  });
}

export async function sensorIsInUseImp(params) {
  return request(`${global.constants.onlineWeb}/sensor/isInUse?sensorNumber=${params}`,{
    method: 'GET',
  });
}

export async function sensorsInUseImp(params) {
  const temp = new FormData();
  temp.append("sensorIdList",params)
  return request(`${global.constants.onlineWeb}/sensor/sensorsInUse`,{
    method: 'POST',
    body: temp
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

// 测点
export async function getMonitorPointByTerminalNumberAndSensorNumberImp(params) {
  return request(`${global.constants.onlineWeb}/monitorPoint/getMonitorPointByTerminalNumberAndSensorNumber?sensorNumber=${params.sensor.sensorNumber}&terminalNumber=${params.terminal.terminalNumber}`,{
    method: 'GET',
  });
}