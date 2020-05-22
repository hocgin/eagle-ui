import request from '@/utils/request';
import { stringify } from 'qs';

export default class WxMpUserTagsApi {

  static insert(payload) {
    return request(`/api/wx-mp/tags`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static delete({ id, ...payload }) {
    let queryString = stringify(payload);
    return request(`/api/wx-mp/tags/${id}?${queryString}`, {
      method: 'DELETE',
    });
  }

  static update({ id, ...payload }) {
    return request(`/api/wx-mp/tags/${id}`, {
      method: 'PUT',
      body: {
        ...payload,
      },
    });
  }

  static paging(payload) {
    return request(`/api/wx-mp/tags/_paging`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getAll(payload) {
    return request(`/api/wx-mp/tags/all`, {
      method: 'GET',
      body: {
        ...payload,
      },
    });
  }

  static getOne({ id, ...payload }) {
    return request(`/api/wx-mp/tags/${id}`, {
      method: 'GET',
    });
  }


  static refresh({ ...payload }) {
    return request(`/api/wx-mp/tags/refresh`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

}
