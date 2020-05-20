import { message } from 'antd';

export default class ValidUtils {

  static isTrue(expression: boolean, msg: String): boolean {
    if (!expression) {
      message.error(msg);
      return false;
    }
    return true;
  }

};
