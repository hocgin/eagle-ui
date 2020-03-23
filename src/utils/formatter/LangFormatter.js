
export class LangFormatter {

  static formatRMB(val, def = '空') {
    if (val === null || val === undefined) {
      return def;
    }
    return `¥ ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
