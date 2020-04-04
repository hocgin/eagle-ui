import request from '@/utils/request';

export default class RequestLogApi {
  static paging(payload) {
    return request(`/api/request-log/_paging`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getOne({ id, ...payload }) {
    return request(`/api/request-log/${id}:complex`, {
      method: 'GET',
    });
  }


}
