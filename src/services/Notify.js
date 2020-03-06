import request from '@/utils/request';

export default class NotifyAPI {

  static getSummary({ payload }) {
    return request(`/api/notification/summary`, {
      method: 'GET',
    });
  }


}
