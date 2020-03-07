import Utils from '@/utils/utils';
import { message } from 'antd';
import NotifyApi from '@/services/Notify';

export default {
  namespace: 'notify',
  state: {},
  effects: {
    * getNotifications({ payload = {}, callback }, { call, put }) {
      let result = yield NotifyApi.getNotifications(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      if (callback) {
        callback(result);
      }
    },
  },
  reducers: {},
  subscriptions: {},
};
