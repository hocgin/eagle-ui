import request from '@/utils/request';

export default class WxMpMessageApi {

  static sendMessageToUser(payload) {
    return request(`/api/wx-mp/message/send@user`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static sendMessageToGroup(payload) {
    return request(`/api/wx-mp/message/send@group`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static sendTemplateMessageToUser(payload) {
    return request(`/api/wx-mp/message/template/send@user`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

  static sendPreviewMessageToUser(payload) {
    return request(`/api/wx-mp/message/preview/send@user`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  }

}
