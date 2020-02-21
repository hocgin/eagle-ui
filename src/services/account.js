import request from '@/utils/request';
import { stringify } from 'qs';

export default class AccountApi {

  static login(payload) {
    return request(`/api/account/authenticate`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getCurrentAccount(payload) {
    let queryString = stringify(payload);
    return request(`/api/account?${queryString}`, {
      method: 'GET',
    });
  }

}