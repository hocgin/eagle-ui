import moment from 'moment';

export class DateFormatter {
  static FORMAT_1 = 'YYYY-MM-DD HH:mm:ss';

  static timestampAs(timestamp, format = DateFormatter.FORMAT_1, def = '空') {
    if (timestamp === null || timestamp === undefined) {
      return def;
    }
    return moment(timestamp).format(format);
  }
}