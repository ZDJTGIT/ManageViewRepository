import { getAddSectorBaseImp,addProjectImp } from '@/services/monitor/startProject';

export default {
  namespace: 'sector',
  state: {
    start:"",
    payload:"",
  },

  effects: {
    *getAddSectorBase({ payload, callback }, { call, put }){
      const response = yield call(getAddSectorBaseImp,payload);
      yield put({
        type: 'baseChange',
        payload: response
      })
    },
    *addProject({payload,callback},{call,put}){
      const response = yield call(addProjectImp,payload);
      callback(response);
    }
  },

  reducers: {
    baseChange(state,{ payload }){
      return{
        ...state,
        start: payload.data,
      }
    }
  },
};