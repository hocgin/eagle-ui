import Utils from '@/utils/utils';
import { message } from 'antd';
import AuthorityApi from '@/services/authority';

export default {
  namespace: 'authority',
  state: {
    all: [],
    authorityTree: [],
    detail: null,
  },
  effects: {
    * getAllAuthority({ payload }, { call, put }) {
      let result = yield AuthorityApi.getAll(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      yield put({
        type: 'fillAll',
        payload: result.data,
      });
    },
    * getAuthorityTree({ payload }, { call, put }) {
      let result = yield AuthorityApi.getAuthorityTree(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      yield put({
        type: 'fillAuthorityTree',
        payload: result.data,
      });
    },
    * getAuthority({ payload }, { call, put }) {
      let result = yield AuthorityApi.getOne(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      yield put({
        type: 'fillDetail',
        payload: result.data,
      });
    },
    * insertOne({ payload, callback }, { call, put }) {
      let result = yield AuthorityApi.insert(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      if (callback) {
        callback();
      }
    },
    * updateOne({ payload, callback }, { call, put }) {
      let result = yield AuthorityApi.update(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      if (callback) {
        callback();
      }
    },
    * delete({ payload, callback }, { call, put }) {
      let result = yield AuthorityApi.delete(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      if (callback) {
        callback();
      }
    },
    * grantRole({ payload, callback }, { call, put }) {
      let result = yield AuthorityApi.grantRole(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      if (callback) {
        callback();
      }
    },
  },
  reducers: {
    fillAll(state, { payload }) {
      return {
        ...state,
        all: payload,
      };
    },
    fillAuthorityTree(state, { payload }) {
      return {
        ...state,
        authorityTree: payload,
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