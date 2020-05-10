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
        code: 'ums', icon: 'user', path: '/ums',
        routes: [
          { code: 'ums:account', path: '/ums/account', component: '../pages/Ums/Account' },
          {
            code: 'ums:group', path: '/ums/group', hideChildrenInMenu: true,
            routes: [{
              code: 'ums:group',
              path: '/ums/group',
              component: '../pages/Ums/Group',
            }, {
              code: 'ums:group:detail',
              path: '/ums/group/:id',
              component: '../pages/Ums/Group/Detail',
            }],
          },
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
          {
            code: 'devtools:data-dict',
            icon: 'database',
            path: '/devtools/data-dict',
            component: '../pages/Devtools/DataDict',
          },
          {
            code: 'devtools:request-log',
            icon: 'cloud',
            path: '/devtools/request-log',
            component: '../pages/Devtools/RequestLog',
          },
          {
            code: 'devtools:short-url',
            icon: 'link',
            path: '/devtools/short-url',
            component: '../pages/Devtools/ShortUrl',
          },
          {
            code: 'devtools:settings',
            icon: 'setting',
            path: '/devtools/settings',
            component: '../pages/Devtools/Settings',
          },
          {
            code: 'devtools:debug',
            icon: 'sketch',
            path: '/devtools/debug',
            routes: [{
              code: 'devtools:debug:comment',
              icon: 'comment',
              path: '/devtools/debug/comment',
              component: '../pages/Devtools/Debug/Comment',
            }],
          },
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
      }, {
        // 【微信】
        code: 'wx', icon: 'wechat', path: '/wx',
        routes: [
          { code: 'wx:mp-config', path: '/wx/mp-config', component: '../pages/Wx/Config' },
          { code: 'wx:mp-user', path: '/wx/mp-user', component: '../pages/Wx/User' },
          { code: 'wx:mp-menu', path: '/wx/mp-menu', component: '../pages/Wx/Menu' },
          { code: 'wx:mp-material', path: '/wx/mp-menu', component: '../pages/Wx/Material' },
        ],
      },
    ],
  },
];
