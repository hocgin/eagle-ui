export class LangFormatter {

  static formatRMB(val, def = '空') {
    if (val === null || val === undefined) {
      return def;
    }
    val = val.toFixed(2);
    return `¥ ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * 格式化优惠值
   * @param val
   * @param isAmount
   * @return {string|string}
   */
  static formatCouponValue(val, isAmount = false) {
    if (isAmount) {
      return LangFormatter.formatRMB(val);
    }
    return `${val * 100} 折`;
  }

}
