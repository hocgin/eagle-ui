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

  /**
   * 查看菜单详情
   * @param id
   */
  static menuDetail(id) {
    history.push({ pathname: `/wx/mp-menu/${id}` });
  }

  static menuAdd(appid = '') {
    history.push({
      pathname: `/wx/mp-menu/create`, query: {
        appid: `${appid}`,
      },
    });
  }

  static wxMaterialCreateNews(appid) {
    history.push({
      pathname: `/wx/mp-material/create-news`, query: {
        appid: `${appid}`,
      },
    });
  }

  static wxMaterialCreateVoice(appid) {
    history.push({
      pathname: `/wx/mp-material/create-voice`, query: {
        appid: `${appid}`,
      },
    });
  }

  static wxMaterialCreateImage(appid) {
    history.push({
      pathname: `/wx/mp-material/create-image`, query: {
        appid: `${appid}`,
      },
    });
  }

  static wxMaterialCreateVideo(appid) {
    history.push({
      pathname: `/wx/mp-material/create-video`, query: {
        appid: `${appid}`,
      },
    });
  }
};
