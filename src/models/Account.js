import AccountApi from '@/services/Account';
import UiUtils from '@/utils/UiUtils';

export default {
  namespace: 'account',
  state: {
    detail: null,
    paging: null,
    complete: [],
  },
  effects: {
    // 检索
    * getComplete({ payload = {}, callback }, { call, put }) {
      let result = yield AccountApi.getComplete(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillComplete', payload: result.data });
        if (callback) callback(result);
      }
    },
    * paging({ payload = {}, callback }, { call, put }) {
      let result = yield AccountApi.paging(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillPaging', payload: result.data });
        if (callback) callback(result);
      }
    },
    * grantRole({ payload = {}, callback }, { call, put }) {
      let result = yield AccountApi.grantRole(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    * updateStatus({ payload = {}, callback }, { call, put }) {
      let result = yield AccountApi.updateStatus(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    * getOne({ payload = {}, callback }, { call, put }) {
      let result = yield AccountApi.getOne(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillDetail', payload: result.data });
        if (callback) callback(result);
      }
    },
  },
  reducers: {
    fillComplete(state, { payload }) {
      return { ...state, complete: payload };
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
