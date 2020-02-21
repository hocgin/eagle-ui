export default class Utils {

  /**
   * 请求是否成功
   * @param result
   * @returns {boolean}
   */
  static isSuccess(result) {
    return result && result.code === 200;
  }

  /**
   * 加载中
   */
  static isLoading(isLoading) {
    return isLoading === undefined || isLoading === true;
  }

  /**
   * 自动输出第一条错误信息
   * @param errors
   */
  static getErrorMessage(errors) {
    let keys = Object.keys(errors || {});
    if (keys.length > 0) {
      return errors[keys[0]].message;
    }
  }

}