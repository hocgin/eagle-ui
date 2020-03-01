import request from '@/utils/request';
import { stringify } from 'qs';

export default class RoleApi {

  static paging(payload) {
    return request(`/api/role/_search`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getOne({ id, ...payload }) {
    return request(`/api/role/${id}`, {});
  }

  static update({ id, ...payload }) {
    return request(`/api/role/${id}`, {
      method: 'PUT',
      body: {
        ...payload,
      },
    });
  }

  static insert(payload) {
    return request(`/api/role`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static grantAuthority({ id, ...payload }) {
    return request(`/api/role/${id}/grant/authority`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static delete({ id, ...payload }) {
    let queryString = stringify(payload);
    return request(`/api/role/${id}?${queryString}`, {
      method: 'DELETE',
    });
  }

}