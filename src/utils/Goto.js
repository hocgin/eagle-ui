import { router } from 'umi';

export default class Goto {

  /**
   * 登录页面
   */
  static login() {
    router.push('/login');
  }
};
