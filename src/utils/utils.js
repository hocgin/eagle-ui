export default class Utils {

  /**
   * 请求是否成功
   * @param result
   * @returns {boolean}
   */
  static isSuccess(result) {
    return result && result.success;
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

  /**
   * /sd/sd/sd => ["/sd", "/sd/sd", "/sd/sd/sd"]
   * @param url
   * @return {string[]}
   */
  static urlToList(url) {
    const urllist = url.split('/').filter(i => i);
    return urllist.map((urlItem, index) => `/${urllist.slice(0, index + 1).join('/')}`);
  }


  /**
   * 拆分数组
   * chunk([1,2,3,4,5], 2) => [[1,2], [3, 4], [5]]
   * @param array
   * @param length
   * @returns {Array}
   */
  static chunk(array, length) {
    let index = 0;
    let newArray = [];

    while (index < array.length) {
      newArray.push(array.slice(index, index += length));
    }
    return newArray;
  }



  /**
   * 切割数据
   * - 情况1
   * slice([1,2,3,4], 2)
   * [1,2]
   * - 情况2
   * slice([1], 2)
   * [1]
   * @param array
   * @param max
   * @returns {*}
   */
  static slice(array, max) {
    if (array.length < max) {
      max = array.length;
    }
    return array.slice(0, max);
  }


}
