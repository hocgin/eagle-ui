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
      { code: 'dashboard', icon: 'dashboard', path: '/home/dashboard', component: '../pages/home/dashboard' },
      // 测试
      {
        code: 'devtools', icon: 'test', path: '/devtools',
        routes: [
          { code: 'test', icon: 'home', path: '/devtools/test2', component: '../pages/index' },
          { code: 'test5', icon: 'dashboard', path: '/devtools/test5', component: '../pages/home/dashboard' },
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
      title: 'eagle-ui',
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
