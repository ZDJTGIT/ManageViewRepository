import { getAllParserMethodsImp } from '@/services/core/SysCode'
export default {
  namespace: 'sysCode',
  state: {
    parserMethods:[] // 解析方式
  },

  effects: {
    // 终端
    *getAllParserMethods({ payload, callback }, { call, put }){
      const response = yield call(getAllParserMethodsImp,payload);
      yield put({
        type: 'ParserMethodChange',
        payload: response
      })
    },
  },

  reducers: {
    // 终端
    ParserMethodChange(state,{ payload }){
      return{
        ...state,
        parserMethods: payload.data,
      }
    },
  },
};