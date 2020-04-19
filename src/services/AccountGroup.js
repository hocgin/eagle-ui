import request from '@/utils/request';
import { stringify } from 'qs';

export default class AccountGroupApi {

  static insert(payload) {
    return request(`/api/account-group`, {
      method: 'POST',
      body: { ...payload },
    });
  }

  static delete({ id, ...payload }) {
    let queryString = stringify(payload);
    return request(`/api/account-group/${id}?${queryString}`, {
      method: 'DELETE',
    });
  }

  static update({ id, ...payload }) {
    return request(`/api/account-group/${id}`, {
      method: 'PUT',
      body: { ...payload },
    });
  }


  static getOne({ id, ...payload }) {
    return request(`/api/account-group/${id}:complex`, {
      method: 'GET',
    });
  }

  static paging(payload) {
    return request(`/api/account-group/_paging`, {
      method: 'POST',
      body: { ...payload },
    });
  }

  static joinWithMember({ groupId, ...payload }) {
    return request(`/api/account-group/${groupId}/join`, {
      method: 'POST',
      body: { ...payload },
    });
  }

  static pagingWithMember({ groupId, ...payload }) {
    return request(`/api/account-group/${groupId}/member/_paging`, {
      method: 'POST',
      body: { ...payload },
    });
  }

  static deleteWithMember({ groupId, ...payload }) {
    return request(`/api/account-group/${groupId}/member`, {
      method: 'DELETE',
      body: { ...payload },
    });
  }

}
