import { getAllTerminalsImp,addTerminalImp,updateTerminalImp,deleteTerminalImp,deleteTerminalsImp,isInUseImp,terminalsInUseImp } from '@/services/device/DeviceList';
import { getAllSensorsImp,addSensorImp,updateSensorImp,deleteSensorImp,deleteSensorsImp,sensorIsInUseImp,sensorsInUseImp } from '@/services/device/DeviceList';
import { getAllDeviceConfigsImp,addDeviceConfigImp,updateDeviceConfigImp,deleteDeviceConfigImp } from '@/services/device/DeviceList';
import { getMonitorPointByTerminalNumberAndSensorNumberImp } from '@/services/device/DeviceList';

export default {
  namespace: 'deviceList',
  state: {
    devices:[], // 终端列表
    sensors:[], // 传感器列表
    deviceConfigs:[], // 设备绑定列表
  },

  effects: {
    // 终端
    *getAllTerminals({ payload, callback }, { call, put }){
      const response = yield call(getAllTerminalsImp,payload);
      yield put({
        type: 'DeviceChange',
        payload: response
      })
    },
    *addTerminal({ payload, callback }, { call, put }){
      const response = yield call(addTerminalImp,payload);
      callback(response);
    },
    *updateTerminal({ payload, callback }, { call, put }){
      const response = yield call(updateTerminalImp,payload);
      callback(response);
    },
    *deleteTerminal({ payload, callback }, { call, put }){
      const response = yield call(deleteTerminalImp,payload);
      callback(response);
    },
    *deleteTerminals({ payload, callback }, { call, put }){
      const response = yield call(deleteTerminalsImp,payload);
      callback(response);
    },
    *isInUse({ payload, callback }, { call, put }){
      const response = yield call(isInUseImp,payload);
      callback(response);
    },
    *terminalsInUse({ payload, callback }, { call, put }){
      const response = yield call(terminalsInUseImp,payload);
      callback(response);
    },

    // 传感器
    *getAllSensors({ payload, callback }, { call, put }){
      const response = yield call(getAllSensorsImp,payload);
      yield put({
        type: 'SensorChange',
        payload: response
      })
    },
            
    *addSensor({ payload, callback }, { call, put }){
      const response = yield call(addSensorImp,payload);
      callback(response);
    },

    *updateSensor({ payload, callback }, { call, put }){
      const response = yield call(updateSensorImp,payload);
      callback(response);
    },

    *deleteSensor({ payload, callback }, { call, put }){
      const response = yield call(deleteSensorImp,payload);
      callback(response);
    },
    
    *deleteSensors({ payload, callback }, { call, put }){
      const response = yield call(deleteSensorsImp,payload);
      callback(response);
    },

    *sensorIsInUse({ payload, callback }, { call, put }){
      const response = yield call(sensorIsInUseImp,payload);
      callback(response);
    },

    *sensorsInUse({ payload, callback }, { call, put }){
      const response = yield call(sensorsInUseImp,payload);
      callback(response);
    },
    // 终-传绑定
    *getAllDeviceConfigs({ payload, callback }, { call, put }){
      const response = yield call(getAllDeviceConfigsImp,payload);
      yield put({
        type: 'DeviceConfigChange',
        payload: response
      })
    },
    *addDeviceConfig({ payload, callback }, { call, put }){
      const response = yield call(addDeviceConfigImp,payload);
      callback(response);
    },
    *updateDeviceConfig({ payload, callback }, { call, put }){
      const response = yield call(updateDeviceConfigImp,payload);
      callback(response);
    },
    *deleteDeviceConfig({ payload, callback }, { call, put }){
      const response = yield call(deleteDeviceConfigImp,payload);
      callback(response);
    },
    // 测点
    *getMonitorPointByTerminalNumberAndSensorNumber({ payload, callback }, { call, put }){
      const response = yield call(getMonitorPointByTerminalNumberAndSensorNumberImp,payload);
      callback(response);
    },
  },



  reducers: {
    // 终端
    DeviceChange(state,{ payload }){
      return{
        ...state,
        devices: payload.data,
      }
    },

    // 传感器
    SensorChange(state,{ payload }){
      return{
        ...state,
        sensors: payload.data,
      }
    },

    // 终-传绑定
    DeviceConfigChange(state,{ payload }){
      return{
        ...state,
        deviceConfigs: payload.data,
      }
    }
  },
};