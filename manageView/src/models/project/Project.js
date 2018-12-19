import { getProjectsImp,addProjectImp,deleteProjectImp } from '@/services/project/Project';

export default {
  namespace: 'monitorProject',
  state: {
    projects:[],
  },

  effects: {
    *getProjects({ payload, callback }, { call, put }){
      const response = yield call(getProjectsImp,payload);
      yield put({
        type: 'projectsChange',
        payload: response
      })
    },
    *addProject({ payload, callback }, { call, put }){
      const response = yield call(addProjectImp,payload);
      callback(response);
    },
    *deleteProject({ payload, callback }, { call, put }){
      const response = yield call(deleteProjectImp,payload);
      callback(response);
    },
    *updateProject({ payload, callback }, { call, put }){
      const response = yield call(deleteProjectImp,payload);
      callback(response);
    },
  },

  reducers: {
    projectsChange(state,{ payload }){
      return{
        ...state,
        projects: payload.data,
      }
    }
  },
};