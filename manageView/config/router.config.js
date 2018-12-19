export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/monitor/startSector' },
      {
        // name: 'exception',
        icon: 'warning',
        path: '/exception',
        Routes: ['src/pages/Authorized'],
        authority: ['admin','user'],
        
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        name: 'sector',
        icon: 'retweet',
        path: '/monitor',
        routes: [
          // result
          {
            path: '/monitor/user',
            name: 'user',
            component: './monitor/user/User',
            Routes: ['src/pages/Authorized'],
            authority: [ 'admin','user'],
          },
          {
            path: '/monitor/project',
            name: '项目',
            component: './monitor/project/Project',
            Routes: ['src/pages/Authorized'],
            authorityL: ['admin','user'],
          },
          // {
          //   path: '/monitor/startSector',
          //   name: 'startSector',
          //   component: './monitor/startProject/startProject',
          //   Routes: ['src/pages/Authorized'],
          //   authority: [ 'admin','user'],
          // },
          // {
          //   path: '/monitor/test',
          //   name: 'test',
          //   component: './monitor/test',
          // },
        ],
      },
    ],
  },
];
