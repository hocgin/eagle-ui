import UiUtils from '@/utils/UiUtils';
import WxMpMessageApi from '@/services/WxMpMessage';

export default {
  namespace: 'wxMpMessage',
  state: {},
  effects: {
    * sendMessageToUser({ payload = {}, callback }, { call, put }) {
      let result = yield WxMpMessageApi.sendMessageToUser(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    * sendMessageToGroup({ payload = {}, callback }, { call, put }) {
      let result = yield WxMpMessageApi.sendMessageToGroup(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    * sendTemplateMessageToUser({ payload = {}, callback }, { call, put }) {
      let result = yield WxMpMessageApi.sendTemplateMessageToUser(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    * sendPreviewMessageToUser({ payload = {}, callback }, { call, put }) {
      let result = yield WxMpMessageApi.sendPreviewMessageToUser(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
  },
  reducers: {
    fillAll(state, { payload }) {
      return { ...state, all: payload };
    },
    fillPaging(state, { payload }) {
      return { ...state, paging: payload };
    },
    fillDetail(state, { payload }) {
      return { ...state, detail: payload };
    },
  },
  subscriptions: {},
};
