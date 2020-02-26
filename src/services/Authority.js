import request from '@/utils/request';
import { stringify } from 'qs';

export default class AuthorityApi {

  static getAll(payload) {
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

  static getOne({ id, ...payload }) {
    let queryString = stringify(payload);
    return request(`/api/authority/${id}:complex?${queryString}`, {
      method: 'GET',
    });
  }

  static update({ id, ...payload }) {
    return request(`/api/authority/${id}`, {
      method: 'PUT',
      body: {
        ...payload,
      },
    });
  }

  static insert(payload) {
    return request(`/api/authority`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static delete({ id, ...payload }) {
    let queryString = stringify(payload);
    return request(`/api/authority/${id}?${queryString}`, {
      method: 'DELETE',
    });
  }

  static grantRole({ id, ...payload }) {
    return request(`/api/authority/${id}/grant/role`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

}