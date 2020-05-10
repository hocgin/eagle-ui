import request from '@/utils/request';
import { stringify } from 'qs';

export default class WxMpUserApi {

  static insert(payload) {
    return request(`/api/wx-mp/user`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static delete({ id, ...payload }) {
    let queryString = stringify(payload);
    return request(`/api/wx-mp/user/${id}?${queryString}`, {
      method: 'DELETE',
    });
  }

  static update({ id, ...payload }) {
    return request(`/api/wx-mp/user/${id}`, {
      method: 'PUT',
      body: {
        ...payload,
      },
    });
  }

  static paging(payload) {
    return request(`/api/wx-mp/user/_paging`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getAll(payload) {
    return request(`/api/wx-mp/user/all`, {
      method: 'GET',
      body: {
        ...payload,
      },
    });
  }

  static getOne({ id, ...payload }) {
    return request(`/api/wx-mp/user/${id}`, {
      method: 'GET',
    });
  }

}
