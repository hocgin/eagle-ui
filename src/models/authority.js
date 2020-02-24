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
    * findAll({ payload }, { call, put }) {
      let result = yield AuthorityApi.findAll(payload);
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
      let result = yield AuthorityApi.getAuthority(payload);
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
      let result = yield AuthorityApi.insertAuthority(payload);
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