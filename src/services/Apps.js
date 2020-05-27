import request from '@/utils/request';

export default class AppsApi {

  /**
   * 注册
   * @param payload
   * @return {Promise<unknown>}
   */
  static signUp(payload) {
    return request(`/api/sign-up`, {
      method: 'POST',
      body: { ...payload },
    });
  }

  /**
   * 发送验证码
   * @param payload
   * @return {Promise<unknown>}
   */
  static sendSmsCode(payload) {
    return request(`/api/sms-code`, {
      method: 'POST',
      body: { ...payload },
    });
  }

}
