// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  routes: [{
    path: '/login',
    component: '../layouts/EmptyLayout',
    routes: [
      { path: '/login', component: '../pages/login/index' },
    ],
  }, {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      { code: 'index', icon: 'home', path: '/home' },
      { path: '/dashboard', redirect: '/home/dashboard' },
      { code: 'dashboard', icon: 'dashboard', path: '/home/dashboard', component: '../pages/home/dashboard' },
      // 用户
      // 【用户】-【权限】
      {
        code: 'access', icon: 'test', path: '/access',
        routes: [
          { code: 'authority', path: '/access/authority', component: '../pages/Access/Authority' },
          { code: 'role', path: '/access/role', component: '../pages/Access/Role' }],
      },
      // 测试
      {
        code: 'devtools', icon: 'test', path: '/devtools',
        routes: [
          { code: 'data-dict', icon: 'home', path: '/devtools/data-dict', component: '../pages/Devtools/DataDict' },
          { code: 'test', icon: 'home', path: '/devtools/test2', component: '../pages/index' },
          { code: 'test5', icon: 'dashboard', path: '/devtools/test5', component: '../pages/home/dashboard' },
        ],
      },
      //【账号】
      {
        path: '/account',
        routes: [
          {
            path: '/account/settings',
            component: '../pages/Account/Settings/_layout',
            routes: [
              { path: '/account/settings', redirect: '/account/settings/base' },
              { path: '/account/settings/base', component: '../pages/Account/Settings/BaseView' },
            ],
          },
          {
            path: '/account/notifications',
            component: '../pages/Account/Notifications',
            // routes: [
            //   { path: '/account/notifications', redirect: '/account/notifications/all' },
            //   { path: '/account/notifications/all', component: '../pages/Account/Notifications/All' },
            // ],
          },
        ],
      },
    ],
  },
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'EAGLE UI',
      dll: false,

      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
};
