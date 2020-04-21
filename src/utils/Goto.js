import { history } from 'umi';

export default class Goto {
  /**
   * 个人资料
   */
  static profileSettings() {
    history.push({
      pathname: '/profile/settings',
    });
  }

  /**
   * 个人通知中心
   */
  static profileNotifications(type = 'privateLetter') {
    history.push({
      pathname: '/profile/notifications',
      query: { type: type },
    });
  }

  /**
   * 登录页面
   */
  static login() {
    history.push({
      pathname: '/login',
    });
  }

  /**
   * 优惠券详情
   * @param id
   */
  static couponDetail(id) {
    history.push({
      pathname: `/mkt/coupon/${id}`,
    });
  }

  /**
   * 订单详情
   * @param id
   */
  static orderDetail(id) {
    history.push({
      pathname: `/oms/order/${id}`,
    });
  }

  /**
   * 退费申请详情
   * @param id
   */
  static refundApplyDetail(id) {
    history.push({ pathname: `/oms/order-refund-apply/${id}` });
  }

  /**
   * 详情页面
   * @param id
   */
  static accountMemberDetailPage(id) {
    history.push({ pathname: `/ums/group/${id}` });
  }
};
