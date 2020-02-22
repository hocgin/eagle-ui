import AccountApi from '@/services/account';
import Utils from '@/utils/utils';
import { message } from 'antd';
import LocalStorage from '@/utils/localstorage';
import { Global } from '@/utils/constant/global';
import { router } from 'umi';

export default {
  namespace: 'account',
  state: {
    currentAccount: {},
    currentAccountAuthority: [],
  },
  effects: {
    * login({ payload }, { call, put }) {
      let result = yield AccountApi.login(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      LocalStorage.setToken(result.data);
      router.push(Global.INDEX_PAGE);
    },
    * getCurrentAccountInfo({ payload = {} }, { call, put }) {
      let result = yield AccountApi.getCurrentAccount(payload);
      if (!Utils.isSuccess(result)) {
        router.push(Global.LOGIN_PAGE);
        message.error(result.message);
        return;
      }
      yield put({
        type: 'fillCurrentAccount',
        payload: {
          ...result.data,
        },
      });
    },
    * getCurrentAccountAuthority({ payload = {} }, { call, put }) {
      let result = yield AccountApi.getCurrentAccountAuthority(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      yield put({
        type: 'fillCurrentAccountAuthority',
        payload: [
          ...result.data,
        ],
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
    fillCurrentAccountAuthority(state, { payload }) {
      return {
        ...state,
        currentAccountAuthority: payload,
      };
    },
  },
  subscriptions: {},
};