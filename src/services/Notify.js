import request from '@/utils/request';

export default class NotifyApi {

  static getSummary({ payload = {} }) {
    return request(`/api/notification/summary`, {
      method: 'GET',
    });
  }

  static getNotifications({ ...payload }) {
    return request(`/api/notification`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }


}
