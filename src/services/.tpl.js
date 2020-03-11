import request from '@/utils/request';
import { stringify } from 'qs';

export default class TplApi {

  static insert(payload) {
    return request(`/api/worked`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static delete({ id, ...payload }) {
    let queryString = stringify(payload);
    return request(`/api/worked/${id}?${queryString}`, {
      method: 'DELETE',
    });
  }

  static update({ id, ...payload }) {
    return request(`/api/worked/${id}`, {
      method: 'PUT',
      body: {
        ...payload,
      },
    });
  }

  static paging(payload) {
    return request(`/api/worked/_search`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getAll(payload) {
    return request(`/api/worked/all`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static worked(payload) {
    let queryString = stringify(payload);
    return request(`/api/worked?${queryString}`, {
      method: 'GET',
    });
  }

  static worked2({ id, ...payload }) {
    return request(`/api/worked/${id}`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

}
