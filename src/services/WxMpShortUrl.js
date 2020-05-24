import request from '@/utils/request';
import { stringify } from 'qs';

export default class WxMpShortUrlApi {

  static insert(payload) {
    return request(`/api/wx-mp/short-url`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static delete({ id, ...payload }) {
    let queryString = stringify(payload);
    return request(`/api/wx-mp/short-url/${id}?${queryString}`, {
      method: 'DELETE',
    });
  }

  static update({ id, ...payload }) {
    return request(`/api/wx-mp/short-url/${id}`, {
      method: 'PUT',
      body: {
        ...payload,
      },
    });
  }

  static paging(payload) {
    return request(`/api/wx-mp/short-url/_paging`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getAll(payload) {
    return request(`/api/wx-mp/short-url/all`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getOne({ id, ...payload }) {
    return request(`/api/wx-mp/short-url/${id}`, {
      method: 'GET',
    });
  }

}
