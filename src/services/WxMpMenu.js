import request from '@/utils/request';
import { stringify } from 'qs';

export default class WxMpMenuApi {

  static insert(payload) {
    return request(`/api/wx-mp/menu`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static delete({ id, ...payload }) {
    let queryString = stringify(payload);
    return request(`/api/wx-mp/menu/${id}?${queryString}`, {
      method: 'DELETE',
    });
  }

  static update({ id, ...payload }) {
    return request(`/api/wx-mp/menu/${id}`, {
      method: 'PUT',
      body: {
        ...payload,
      },
    });
  }

  static paging(payload) {
    return request(`/api/wx-mp/menu/_paging`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getAll(payload) {
    return request(`/api/wx-mp/menu/all`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getOne({ id, ...payload }) {
    return request(`/api/wx-mp/menu/${id}`, {
      method: 'GET',
    });
  }

}
