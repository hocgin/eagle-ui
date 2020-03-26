import request from '@/utils/request';
import { stringify } from 'qs';

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
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

}
