import Utils from '@/utils/utils';
import { message } from 'antd';
import AuthorityApi from '@/services/authority';

export default {
  namespace: 'authority',
  state: {
    result: [],
  },
  effects: {
    * search({ payload }, { call, put }) {
      let result = yield AuthorityApi.search(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      yield put({
        type: 'fillResult',
        payload: result.data,
      });
    },
  },
  reducers: {
    fillResult(state, { payload }) {
      return {
        ...state,
        result: payload,
      };
    },
  },
  subscriptions: {},
};