import Utils from '@/utils/Utils';
import { message } from 'antd';
import NotifyApi from '@/services/Notify';
import UiUtils from '@/utils/UiUtils';

export default {
  namespace: 'notify',
  state: {},
  effects: {
    * getNotifications({ payload = {}, callback }, { call, put }) {
      let result = yield NotifyApi.getNotifications(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
  },
  reducers: {},
  subscriptions: {},
};
