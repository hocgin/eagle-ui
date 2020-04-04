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

  static publishPrivateLetter({ ...payload }) {
    return request(`/api/notification/private-letter/publish`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }


}
