import request from '@/utils/request';

export default class OrderRefundApplyApi {

  static paging(payload) {
    return request(`/api/order-refund-apply/_paging`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getOne({ id, ...payload }) {
    return request(`/api/order-refund-apply/${id}`, {
      method: 'GET',
    });
  }


  static handle({ id, ...payload }) {
    return request(`/api/order-refund-apply/${id}/handle`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }
}
