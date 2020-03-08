import NotifyApi from '@/services/Notify';
import Utils from '@/utils/utils';
import { message } from 'antd';
import AccountApi from '@/services/account';
import LocalStorage from '@/utils/localstorage';
import { router } from 'umi';
import { Global } from '@/utils/constant/global';

export default {
  namespace: 'apps',
  state: {
    currentAccount: {},
    currentAccountAuthority: [],
    notifySummary: {},
  },
  effects: {
    * getNotifySummary({ payload = {} }, { call, put }) {
      let result = yield NotifyApi.getSummary(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      yield put({
        type: 'fillNotifySummary',
        payload: result.data,
      });
    },
    * login({ payload }, { call, put }) {
      let result = yield AccountApi.login(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      LocalStorage.setToken(result.data);
      router.push(Global.INDEX_PAGE);
    },
    * getCurrentAccountInfo({ payload = {}, callback }, { call, put }) {
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
      if (callback) {
        callback();
      }
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
    fillNotifySummary(state, { payload }) {
      return {
        ...state,
        notifySummary: payload,
      };
    },
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
