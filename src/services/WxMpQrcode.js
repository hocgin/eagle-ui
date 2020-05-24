import request from '@/utils/request';
import { stringify } from 'qs';

export default class WxMpQrcodeApi {

  static insert(payload) {
    return request(`/api/wx-mp/qrcode`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static delete({ id, ...payload }) {
    let queryString = stringify(payload);
    return request(`/api/wx-mp/qrcode/${id}?${queryString}`, {
      method: 'DELETE',
    });
  }

  static update({ id, ...payload }) {
    return request(`/api/wx-mp/qrcode/${id}`, {
      method: 'PUT',
      body: {
        ...payload,
      },
    });
  }

  static paging(payload) {
    return request(`/api/wx-mp/qrcode/_paging`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getAll(payload) {
    return request(`/api/wx-mp/qrcode/all`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getOne({ id, ...payload }) {
    return request(`/api/wx-mp/qrcode/${id}`, {
      method: 'GET',
    });
  }

}
