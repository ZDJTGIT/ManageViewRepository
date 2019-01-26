import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha, logOut } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

// 解析token
const utf8ToBase64 = (str)=>{
  return btoa(unescape(encodeURIComponent(str)));
};

const base64ToUtf8 = (str)=>{
  return decodeURIComponent(escape(atob(str)));
};

export default {
  namespace: 'login',

  state: {
    status: '',
    type: '',
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      // const response = await fakeAccountLogin(payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.code === 0) {

        localStorage.setItem('token',response.data);
        // console.log(base64ToUtf8(response.data.split('\.')[1]));
        reloadAuthorized();
        // const urlParams = new URL(window.location.href);
        // const params = getPageQuery();
        // let { redirect } = params;
        // if (redirect) {
        //   const redirectUrlParams = new URL(redirect);
        //   if (redirectUrlParams.origin === urlParams.origin) {
        //     redirect = redirect.substr(urlParams.origin.length);
        //     if(redirect=="/user/login"){
        //       redirect = "/monitor/user"
        //     }
        //     if (redirect.startsWith('/#')) {
        //       redirect = redirect.substr(2);
        //     }
        //   } else {
        //     window.location.href = redirect;
        //     return;
        //   }
        // }
        // yield put(routerRedux.replace(redirect || '/'));
        yield put(routerRedux.replace('/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout({ payload }, { call, put }) {
      const response = yield call(logOut);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          data:{
            status: false,
            currentAuthority: '',
          }
        },
      });
      localStorage.setItem('token','');
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          // 重定向
          // search: stringify({
          //   redirect: window.location.href,
          // }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority("admin");
      if(!payload.data){
        payload.status = "error";
      }else{
        payload.status = "ok"; 
      }
      return {
        ...state,
        status: payload.status,
        type: "account",
      };
    },
  },
};
