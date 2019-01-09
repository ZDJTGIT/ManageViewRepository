import { getSectorsImp,addSectorImp,updateSectorImp } from '@/services/subway/Sector';

export default {
  namespace: 'subwayGlobal',
  state: {
    choosedSector: -1,
  },

  effects: {
    *setChoosedSector({ payload, callback }, { call, put }){
      yield put({
        type: 'choosedSectorChange',
        payload: payload
      });
      callback();
    },
    // *selectChoosedSector({ payload, callback }, { call, put }){
    //   yield put({
    //     type: 'choosedSectorChange',
    //     payload: payload
    //   });
    // },
  },

  reducers: {
    choosedSectorChange(state,{ payload }){
      return{
        ...state,
        choosedSector: payload.sectorId,
      } 
    }
  },
};