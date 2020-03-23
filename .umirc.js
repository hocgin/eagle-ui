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
      // 【用户中心】
      {
        code: 'user', icon: 'user', path: '/user',
        routes: [
          { code: 'account', path: '/user/account', component: '../pages/User/Account' },
        ],
      },
      // 【访问控制】
      {
        code: 'access', icon: 'control', path: '/access',
        routes: [
          { code: 'authority', path: '/access/authority', component: '../pages/Access/Authority' },
          { code: 'role', path: '/access/role', component: '../pages/Access/Role' }],
      },
      // 【开发工具】
      {
        code: 'devtools', icon: 'tool', path: '/devtools',
        routes: [
          { code: 'data-dict', icon: 'database', path: '/devtools/data-dict', component: '../pages/Devtools/DataDict' },
          { code: 'test', icon: 'home', path: '/devtools/test2', component: '../pages/index' },
          { code: 'test5', icon: 'dashboard', path: '/devtools/test5', component: '../pages/home/dashboard' },
        ],
      },
      //【个人设置】
      {
        path: '/profile',
        routes: [
          {
            path: '/profile/settings',
            component: '../pages/Profile/Settings/_layout',
            routes: [
              { path: '/profile/settings', redirect: '/profile/settings/base' },
              { path: '/profile/settings/base', component: '../pages/Profile/Settings/BaseView' },
            ],
          },
          {
            path: '/profile/notifications',
            component: '../pages/Profile/Notifications',
            // routes: [
            //   { path: '/account/notifications', redirect: '/account/notifications/all' },
            //   { path: '/account/notifications/all', component: '../pages/Account/Notifications/All' },
            // ],
          },
        ],
      },
      // 【商品系统】
      {
        code: 'pms', icon: 'shopping', path: '/pms',
        routes: [
          { code: 'pms:product', path: '/pms/product', component: '../pages/Pms/Product' },
        ],
      },
      // 【订单系统】
      {
        code: 'oms', icon: 'shop', path: '/oms',
        routes: [
          { code: 'oms:order', path: '/oms/order', component: '../pages/Oms/Order' },
          { code: 'oms:order:detail', path: '/oms/order/:id', component: '../pages/Oms/Order/Detail' },
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
