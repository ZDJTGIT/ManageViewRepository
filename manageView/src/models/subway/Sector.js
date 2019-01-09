import { getSectorsImp,addSectorImp,updateSectorImp } from '@/services/subway/Sector';

export default {
  namespace: 'subwaySector',
  state: {
    sectors: [],
  },

  effects: {
    *getSectors({ payload, callback }, { call, put }){
      const response = yield call(getSectorsImp,payload);
      yield put({
        type: 'sectorChange',
        payload: response
      })
    },
    *addSector({payload,callback},{call,put}){
      const response = yield call(addSectorImp,payload);
      callback(response);
    },    
    *updateSector({payload,callback},{call,put}){
      const response = yield call(updateSectorImp,payload);
      callback(response);
    }
  },

  reducers: {
    sectorChange(state,{ payload }){
      return{
        ...state,
        sectors: payload.data,
      } 
    }
  },
};