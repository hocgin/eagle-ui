import AccountApi from '@/services/account';
import Utils from '@/utils/utils';
import { message } from 'antd';

export default {
  namespace: 'account',
  state: {
    detail: null,
    paging: null,
  },
  effects: {
    * paging({ payload = {} }, { call, put }) {
      let result = yield AccountApi.paging(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      yield put({
        type: 'fillPaging',
        payload: result.data,
      });
    },
    * grantRole({ payload = {}, callback }, { call, put }) {
      let result = yield AccountApi.grantRole(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      if (callback) {
        callback();
      }
    },
    * updateStatus({ payload = {}, callback }, { call, put }) {
      let result = yield AccountApi.updateStatus(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      if (callback) {
        callback();
      }
    },
    * getOne({ payload = {} }, { call, put }) {
      let result = yield AccountApi.getOne(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      yield put({
        type: 'fillDetail',
        payload: result.data,
      });
    },
  },
  reducers: {
    fillPaging(state, { payload }) {
      return {
        ...state,
        paging: payload,
      };
    },
    fillDetail(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
  },
  subscriptions: {},
};
