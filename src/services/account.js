import request from '@/utils/request';
import { stringify } from 'qs';

export default class AccountApi {

  static paging(payload) {
    return request(`/api/account/_search`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getOne({ id, ...payload }) {
    let queryString = stringify(payload);
    return request(`/api/account/${id}?${queryString}`, {
      method: 'GET',
    });
  }

  static grantRole({ id, ...payload }) {
    return request(`/api/account/${id}/grant/role`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static updateStatus({ id, ...payload }) {
    return request(`/api/account/${id}`, {
      method: 'PUT',
      body: {
        ...payload,
      },
    });
  }

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

  static getCurrentAccountAuthority(payload) {
    let queryString = stringify(payload);
    return request(`/api/account/authority?${queryString}`, {
      method: 'GET',
    });
  }

}
