import NotifyAPI from '@/services/Notify';
import Utils from '@/utils/utils';
import { message } from 'antd';

export default {
  namespace: 'apps',
  state: {
    notifySummary: {},
  },
  effects: {
    * getNotifySummary({ payload = {} }, { call, put }) {
      let result = yield NotifyAPI.getSummary(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      yield put({
        type: 'fillNotifySummary',
        payload: result.data,
      });
    },
  },
  reducers: {
    fillNotifySummary(state, { payload }) {
      return {
        ...state,
        notifySummary: payload,
      };
    },
  },
  subscriptions: {},
};
