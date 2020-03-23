import request from '@/utils/request';

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
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

}
