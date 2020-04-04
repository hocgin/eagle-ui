/**
 * {
 *   code: '',
 *   icon: '',
 *   hideChildrenInMenu: false,
 *   path: '/',
 *   component: '../pages/xx',
 *   routes: []
 * }
 */
export default [
  {
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
      {
        // 【用户中心】
        code: 'ums', icon: 'user', path: '/user',
        routes: [
          { code: 'ums:account', path: '/user/account', component: '../pages/User/Account' },
        ],
      }, {
        // 【访问控制】
        code: 'access', icon: 'control', path: '/access',
        routes: [
          { code: 'authority', path: '/access/authority', component: '../pages/Access/Authority' },
          { code: 'role', path: '/access/role', component: '../pages/Access/Role' }],
      }, {
        // 【开发工具】
        code: 'devtools', icon: 'tool', path: '/devtools',
        routes: [
          { code: 'devtools:data-dict', icon: 'database', path: '/devtools/data-dict', component: '../pages/Devtools/DataDict' },
          {
            code: 'devtools:request-log',
            icon: 'home',
            path: '/devtools/request-log',
            component: '../pages/Devtools/RequestLog',
          },
          { code: 'test5', icon: 'dashboard', path: '/devtools/test5', component: '../pages/home/dashboard' },
        ],
      }, {
        //【个人设置】
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
      }, {
        // 【商品系统】
        code: 'pms', icon: 'shopping', path: '/pms',
        routes: [
          { code: 'pms:product', path: '/pms/product', component: '../pages/Pms/Product' },
          { code: 'pms:product-category', path: '/pms/product-category', component: '../pages/Pms/ProductCategory' },
        ],
      }, {
        // 【订单系统】
        code: 'oms', icon: 'shop', path: '/oms',
        routes: [{
          code: 'oms:order', path: '/oms/order', hideChildrenInMenu: true,
          routes: [
            { code: 'oms:order', path: '/oms/order', component: '../pages/Oms/Order' },
            { code: 'oms:order:detail', path: '/oms/order/:id', component: '../pages/Oms/Order/Detail' },
          ],
        }, {
          code: 'oms:order-refund-apply', path: '/oms/order-refund-apply', hideChildrenInMenu: true,
          routes: [{
            code: 'oms:order-refund-apply',
            path: '/oms/order-refund-apply',
            component: '../pages/Oms/OrderRefundApply',
          }, {
            code: 'oms:order-refund-apply:detail',
            path: '/oms/order-refund-apply/:id',
            component: '../pages/Oms/OrderRefundApply/Detail',
          }],
        }],
      }, {
        // 【营销系统】
        code: 'mkt', icon: 'shop', path: '/mkt',
        routes: [{
          code: 'mkt:coupon', path: '/mkt/coupon', hideChildrenInMenu: true,
          routes: [{
            code: 'mkt:coupon',
            path: '/mkt/coupon',
            component: '../pages/Mkt/Coupon',
          }, {
            code: 'mkt:coupon:detail',
            path: '/mkt/coupon/:id',
            component: '../pages/Mkt/Coupon/Detail',
          }],
        }],
      },
    ],
  },
];
