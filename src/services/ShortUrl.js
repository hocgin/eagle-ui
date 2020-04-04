import request from '@/utils/request';

export default class ShortUrlApi {

  static insert(payload) {
    return request(`/api/short-url`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static update({ id, ...payload }) {
    return request(`/api/short-url/${id}`, {
      method: 'PUT',
      body: {
        ...payload,
      },
    });
  }

  static paging(payload) {
    return request(`/api/short-url/_paging`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

}
