import request from '@/utils/request';
import { stringify } from 'qs';

export default class CouponApi {

  static give({ id, ...payload }) {
    return request(`/api/coupon/${id}/give`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static insert(payload) {
    return request(`/api/coupon`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static delete({ id, ...payload }) {
    let queryString = stringify(payload);
    return request(`/api/coupon/${id}?${queryString}`, {
      method: 'DELETE',
    });
  }

  static update({ id, ...payload }) {
    return request(`/api/coupon/${id}`, {
      method: 'PUT',
      body: {
        ...payload,
      },
    });
  }

  static paging(payload) {
    return request(`/api/coupon/_paging`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getAll(payload) {
    return request(`/api/coupon/all`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getOne({ id, ...payload }) {
    return request(`/api/coupon/${id}:complex`, {
      method: 'GET',
    });
  }

}
