import AccountApi from '@/services/account';
import Utils from '@/utils/utils';
import { message } from 'antd';
import LocalStorage from '@/utils/localstorage';
import { Global } from '@/utils/constant/global';

export default {
  namespace: 'account',
  state: {
    currentAccount: {},
  },
  effects: {
    * login({ payload }, { call, put }) {
      let result = yield AccountApi.login(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      LocalStorage.setToken(result.data);
      window.location = Global.INDEX_PAGE;
    },
    * getCurrentAccountInfo({ payload = {} }, { call, put }) {
      let result = yield AccountApi.getCurrentAccount(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      yield put({
        type: 'account/fillCurrentAccount',
        payload: {
          ...result.data,
        },
      });
    },
  },
  reducers: {
    fillCurrentAccount(state, { payload }) {
      return {
        ...state,
        currentAccount: payload,
      };
    },
  },
  subscriptions: {},
};