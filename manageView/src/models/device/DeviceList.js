import { getAllTerminalsImp,addTerminalImp,updateTerminalImp,deleteTerminalImp } from '@/services/device/DeviceList';
import { getAllSensorsImp,addSensorImp,updateSensorImp,deleteSensorImp } from '@/services/device/DeviceList';
import { getAllDeviceConfigsImp,addDeviceConfigImp,updateDeviceConfigImp,deleteDeviceConfigImp } from '@/services/device/DeviceList';

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
    }
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