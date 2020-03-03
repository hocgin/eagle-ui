import request from '@/utils/request';
import { stringify } from 'qs';

export default class DataDictApi {

  static paging(payload) {
    return request(`/api/data-dict/_search`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static update({ id, ...payload }) {
    return request(`/api/data-dict/${id}`, {
      method: 'PUT',
      body: {
        ...payload,
      },
    });
  }

  static insert(payload) {
    return request(`/api/data-dict`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getOne({ id, ...payload }) {
    let queryString = stringify(payload);
    return request(`/api/data-dict/${id}:complex?${queryString}`, {
      method: 'GET',
    });
  }

  static deletes(payload) {
    return request(`/api/data-dict`, {
      method: 'DELETE',
      body: {
        ...payload,
      },
    });
  }

  static getAllDataDict({ code, ...payload }) {
    let queryString = stringify(payload);
    return request(`/api/data-dict/${code}?${queryString}`, {
      method: 'GET',
    });
  }

}