import request from '@/utils/request';
import { stringify } from 'qs';

export default class ProductCategoryApi {

  static insert(payload) {
    console.log('???');
    return request(`/api/product-category`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static delete({ id, ...payload }) {
    let queryString = stringify(payload);
    return request(`/api/product-category/${id}?${queryString}`, {
      method: 'DELETE',
    });
  }

  static update({ id, ...payload }) {
    return request(`/api/product-category/${id}`, {
      method: 'PUT',
      body: {
        ...payload,
      },
    });
  }

  static paging(payload) {
    return request(`/api/product-category/_paging`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getAll(payload) {
    return request(`/api/product-category/all`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getOne({ id, ...payload }) {
    return request(`/api/product-category/${id}:complex`, {
      method: 'GET',
    });
  }

  static getTree(payload) {
    return request(`/api/product-category/tree`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

}
