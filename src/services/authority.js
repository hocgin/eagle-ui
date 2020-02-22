import request from '@/utils/request';

export default class AuthorityApi {

  static search(payload) {
    return request(`/api/authority/_search`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

}