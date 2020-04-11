import request from '@/utils/request';
import { stringify } from 'qs';

export default class CommentApi {

  static insert(payload) {
    return request(`/api/comment`, {
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

  static pagingWithRootPaging(payload) {
    return request(`/api/comment/_paging`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static pagingWithChildPaging({parentId, ...payload}) {
    return request(`/api/comment/${parentId}/_paging`, {
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
