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
      { path: '/', redirect: '/device/list/1' },
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
      {
        name: '地铁模块',
        icon: 'sliders',
        path: '/subway',
        routes: [
          // result
          {
            path: '/subway/project',
            name: '项目',
            component: './subway/project/Project',
            Routes: ['src/pages/Authorized'],
            authority: [ 'admin','user'],
          },
          {
            path: '/subway/sector',
            name: '区间',
            component: './subway/sector/Sector',
            Routes: ['src/pages/Authorized'],
            authority: [ 'admin','user'],
          },
          {
            path: '/subway/monitorPoint',
            name: '测点',
            component: './subway/monitorPoint/Begin',
            Routes: ['src/pages/Authorized'],
            authority: [ 'admin','user'],
          },
        ],
      },
      {
        name: '设备管理',
        icon: 'sliders',
        path: '/device',
        routes: [
          // result
          {
            path: '/device/list/*',
            name: '终端管理',
            component: './device/List/DeviceList',
            Routes: ['src/pages/Authorized'],
            authority: [ 'admin','user'],
          },
          {
            path: '/device/addDevice',
            // name: '终端添加',
            component: './device/List/steps/Add',
            Routes: ['src/pages/Authorized'],
            authority: [ 'admin','user'],
          },
          {
            path: '/device/sensorlist',
            name: '传感器管理',
            component: './device/List/SensorList',
            Routes: ['src/pages/Authorized'],
            authority: [ 'admin','user'],
          },
          {
            path: '/device/addSensor',
            // name: '传感器添加',
            component: './device/List/steps/SensorAdd',
            Routes: ['src/pages/Authorized'],
            authority: [ 'admin','user'],
          },
          {
            path: '/device/bindDevice',
            name: '设备绑定',
            component: './device/bind/bindList',
            Routes: ['src/pages/Authorized'],
            authority: [ 'admin','user'],
          },
          {
            path: '/device/addDeviceConfig',
            // name: '传感器添加',
            component: './device/bind/steps/Add',
            Routes: ['src/pages/Authorized'],
            authority: [ 'admin','user'],
          },
        ],
      },
    ],
  },
];
