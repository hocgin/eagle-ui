import request from '@/utils/request';

export default class NotifyApi {

  static getSummary(payload) {
    return request(`/worked`, {
      method: 'GET',
      body: {
        ...payload,
      },
    });
  }

}
