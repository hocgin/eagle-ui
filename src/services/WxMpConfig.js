import request from '@/utils/request';
import { stringify } from 'qs';

export default class WxMpConfigApi {

  static insert(payload) {
    return request(`/api/wx-mp/config`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static delete({ id, ...payload }) {
    let queryString = stringify(payload);
    return request(`/api/wx-mp/config/${id}?${queryString}`, {
      method: 'DELETE',
    });
  }

  static update({ id, ...payload }) {
    return request(`/api/wx-mp/config/${id}`, {
      method: 'PUT',
      body: {
        ...payload,
      },
    });
  }

  static paging(payload) {
    return request(`/api/wx-mp/config/_paging`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getAll(payload) {
    return request(`/api/wx-mp/config/all`, {
      method: 'GET',
    });
  }

  static getOne({ id, ...payload }) {
    return request(`/api/wx-mp/config/${id}`, {
      method: 'GET',
    });
  }

}
