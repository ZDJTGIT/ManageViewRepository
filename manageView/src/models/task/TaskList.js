import { getAllTasksImp,addTaskImp,addSimpleTaskImp,deleteTaskImp,updateTaskImp } from '@/services/task/TaskList';

export default {
  namespace: 'taskList',
  state: {
    tasks:[], // 任务列表
  },

  effects: {
    // 终端
    *getAllTasks({ payload, callback }, { call, put }){
      const response = yield call(getAllTasksImp,payload);
      yield put({
        type: 'TaskChange',
        payload: response
      })
    },
    *addTask({ payload, callback }, { call, put }){
      const response = yield call(addTaskImp,payload);
      callback(response);
    },
    *addSimpleTask({ payload, callback }, { call, put }){
      const response = yield call(addSimpleTaskImp,payload);
      callback(response);
    },
    *deleteTask({ payload, callback }, { call, put }){
      const response = yield call(deleteTaskImp,payload);
      callback(response);
    },
    *updateTask({ payload, callback }, { call, put }){
      const response = yield call(updateTaskImp,payload);
      callback(response);
    }
  },



  reducers: {
    TaskChange(state,{ payload }){
      return{
        ...state,
        tasks: payload.data,
      }
    }
  },
};