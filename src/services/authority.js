import request from '@/utils/request';
import { stringify } from 'qs';

export default class AuthorityApi {

  static findAll(payload) {
    return request(`/api/authority/_search`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getAuthorityTree(payload) {
    return request(`/api/authority/tree`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getAuthority({ id, ...payload }) {
    let queryString = stringify(payload);
    return request(`/api/authority/${id}?${queryString}`, {
      method: 'GET',
    });
  }

  static insertAuthority(payload) {
    return request(`/api/authority`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

}