import { getUsersImp,addUserImp,updateUserImp,deleteUserImp } from '@/services/user/User';

export default {
  namespace: 'monitorUser',
  state: {
    users:[],
  },

  effects: {
    *getUser({ payload, callback }, { call, put }){
      const response = yield call(getUsersImp,payload);
      yield put({
        type: 'userChange',
        payload: response
      })
    },
    *addUser({payload, callback},{call,put}){
      const response = yield call(addUserImp,payload);
      callback(response);
    },
    *updateUser({payload,callback},{call,put}){
      const response = yield call(updateUserImp,payload);
      callback(response);
    },
    *deleteUser({payload,callback},{call,put}){
      const response = yield call(deleteUserImp,payload);
      callback(response);
    }
  },

  reducers: {
    userChange(state,{ payload }){
      return{
        ...state,
        users: payload.data,
      }
    }
  },
};