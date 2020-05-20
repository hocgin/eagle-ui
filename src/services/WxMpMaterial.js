import request from '@/utils/request';
import { stringify } from 'qs';

export default class WxMpMaterialApi {

  static insert(payload) {
    return request(`/api/wx-mp/material`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static delete({ id, ...payload }) {
    let queryString = stringify(payload);
    return request(`/api/wx-mp/material/${id}?${queryString}`, {
      method: 'DELETE',
    });
  }

  static update({ id, ...payload }) {
    return request(`/api/wx-mp/material/${id}`, {
      method: 'PUT',
      body: {
        ...payload,
      },
    });
  }

  static paging(payload) {
    return request(`/api/wx-mp/material/_paging`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getAll(payload) {
    return request(`/api/wx-mp/material/all`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static getOne({ id, ...payload }) {
    return request(`/api/wx-mp/material/${id}`, {
      method: 'GET',
    });
  }

  static uploadNews({ id, ...payload }) {
    return request(`/api/wx-mp/material/upload/news`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static uploadVoice({ id, ...payload }) {
    return request(`/api/wx-mp/material/upload/voice`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

}
