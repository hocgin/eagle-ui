
export class LangFormatter {

  static formatRMB(val, def = '空') {
    if (val === null || val === undefined) {
      return def;
    }
    val = val.toFixed(2);
    return `¥ ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

}
