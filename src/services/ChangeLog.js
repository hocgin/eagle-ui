import request from '@/utils/request';

export default class ChangeLogApi {
  static paging(payload) {
    return request(`/api/change-log/_paging`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }
}
