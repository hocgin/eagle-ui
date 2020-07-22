import request from '@/utils/request';
import { stringify } from 'qs';

export default class CouponAccountApi {

  static revoke({ id, ...payload }) {
    return request(`/api/coupon-account/${id}/revoke`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

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
    return request(`/api/coupon-account/_paging`, {
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

  static getOne({ id, ...payload }) {
    return request(`/api/worked/${id}`, {
      method: 'GET',
    });
  }

}
