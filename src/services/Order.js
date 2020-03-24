import request from '@/utils/request';
import { stringify } from 'qs';

export default class OrderApi {

  static paging(payload) {
    return request(`/api/order/_paging`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getOne({ id, ...payload }) {
    return request(`/api/order/${id}`, {
      method: 'GET',
    });
  }

  static delete({ id, ...payload }) {
    let queryString = stringify(payload);
    return request(`/api/order/${id}?${queryString}`, {
      method: 'DELETE',
    });
  }

  static close({ id, ...payload }) {
    return request(`/api/order/close`, {
      method: 'PUT',
      body: {
        id,
        ...payload,
      },
    });
  }

  static shipped({ id, ...payload }) {
    return request(`/api/order/shipped`, {
      method: 'PUT',
      body: {
        id,
        ...payload,
      },
    });
  }

  static update({ id, ...payload }) {
    return request(`/api/order/${id}`, {
      method: 'PUT',
      body: {
        ...payload,
      },
    });
  }

}
