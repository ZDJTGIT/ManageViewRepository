import { queryNotices,xxx } from '@/services/api';

export default {
  namespace: 'test',

  state: {
    kx: ['444','666'],
  
  },

  effects: {
   *fetch({ payload,callBack }, { call, put }){
    const response = yield call(xxx, payload);
    console.log(response);
    yield put({
      type: 'changeLayoutCollapsed',
      payload: response
    })
     console.log(payload);
     callBack();
     }
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
       
      };
    },
   
   
  },
};
