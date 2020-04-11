import moment from 'moment';

export class DateFormatter {
  static FORMAT_1 = 'YYYY-MM-DD HH:mm:ss';
  static FORMAT_2 = 'YYYY-MM-DD HH:mm';

  /**
   * 格式化时间
   * @param timestamp
   * @param format
   * @param def
   * @return {string}
   */
  static timestampAs(timestamp, format = DateFormatter.FORMAT_1, def = 'N/A') {
    if (timestamp === null || timestamp === undefined) {
      return def;
    }
    return moment(timestamp).format(format);
  }

  /**
   * 相对时间
   * @param timestamp
   * @param len
   * @param defFormat
   * @return {string|*}
   */
  static relativeFromNow(timestamp, len = 10 * 24 * 60 * 60 * 1000, defFormat = DateFormatter.FORMAT_2) {
    if (timestamp < new Date().getTime() - len) {
      return this.timestampAs(timestamp, defFormat);
    }
    return moment(timestamp).fromNow();
  }
}
