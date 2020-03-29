import { router } from 'umi';

export default class Goto {

  /**
   * 登录页面
   */
  static login() {
    router.push('/login');
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
};
