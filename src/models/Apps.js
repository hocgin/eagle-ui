import NotifyApi from '@/services/Notify';
import AccountApi from '@/services/Account';
import LocalStorage from '@/utils/LocalStorage';
import { history } from 'umi';
import { Global } from '@/utils/constant/global';
import UiUtils from '@/utils/UiUtils';

export default {
  namespace: 'apps',
  state: {
    currentAccount: {},
    currentAccountAuthority: [],
    notifySummary: {},
  },
  effects: {
    * getNotifySummary({ payload = {}, callback }, { call, put }) {
      let result = yield NotifyApi.getSummary(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillNotifySummary', payload: result.data });
        if (callback) callback(result);
      }
    },
    * login({ payload = {}, callback }, { call, put }) {
      let result = yield AccountApi.login(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
        LocalStorage.setToken(result.data);
        history.push(Global.INDEX_PAGE);
      }
    },
    * getCurrentAccountInfo({ payload = {}, callback }, { call, put }) {
      let result = yield AccountApi.getCurrentAccount(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillCurrentAccount', payload: result.data });
        if (callback) callback(result);
        return;
      }
      history.push(Global.LOGIN_PAGE);
    },
    * getCurrentAccountAuthority({ payload = {}, callback }, { call, put }) {
      let result = yield AccountApi.getCurrentAccountAuthority(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillCurrentAccountAuthority', payload: result.data });
        if (callback) callback(result);
      }
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
