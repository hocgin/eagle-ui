import request from '@/utils/request';
import { stringify } from 'qs';

export default class DataDictApi {

  static getAllDataDict({code, ...payload}) {
    let queryString = stringify(payload);
    return request(`/api/data-dict/${code}?${queryString}`, {
      method: 'GET',
    });
  }

}