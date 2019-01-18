import { getAllParserMethodsImp,getAllMonitorTypeImp } from '@/services/core/SysCode'
export default {
  namespace: 'sysCode',
  state: {
    parserMethods:[], // 解析方式
    monitorPoints:[], // 监测类型
  },

  effects: {
    // 解析方式
    *getAllParserMethods({ payload, callback }, { call, put }){
      const response = yield call(getAllParserMethodsImp,payload);
      yield put({
        type: 'ParserMethodChange',
        payload: response
      })
    },

    // 监测类型
    *getAllMonitorType({ payload, callback }, { call, put }){
      const response = yield call(getAllMonitorTypeImp,payload);
      yield put({
        type: 'MonitorTypeChange',
        payload: response
      })
    },
  },

  reducers: {
    // 解析方式
    ParserMethodChange(state,{ payload }){
      return{
        ...state,
        parserMethods: payload.data,
      }
    },

    // 监测类型
    MonitorTypeChange(state,{ payload }){
      return{
        ...state,
        monitorPoints: payload.data,
      }
    },
  },
};