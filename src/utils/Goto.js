import router from 'umi/router';

export default class Goto {
  /**
   * 个人资料
   */
  static profileSettings() {
    router.push({
      pathname: '/profile/settings',
    });
  }

  /**
   * 个人通知中心
   */
  static profileNotifications(type = 'privateLetter') {
    router.push({
      pathname: '/profile/notifications',
      query: { type: type },
    });
  }

  /**
   * 登录页面
   */
  static login() {
    router.push({
      pathname: '/login',
    });
  }

  /**
   * 优惠券详情
   * @param id
   */
  static couponDetail(id) {
    router.push({
      pathname: `/mkt/coupon/${id}`,
    });
  }

  /**
   * 订单详情
   * @param id
   */
  static orderDetail(id) {
    router.push({
      pathname: `/oms/order/${id}`,
    });
  }

  /**
   * 退费申请详情
   * @param id
   */
  static refundApplyDetail(id) {
    router.push({ pathname: `/oms/order-refund-apply/${id}` });
  }

  /**
   * 详情页面
   * @param id
   */
  static accountMemberDetailPage(id) {
    router.push({ pathname: `/ums/group/${id}` });
  }
};
