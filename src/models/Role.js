import Utils from '@/utils/utils';
import { message } from 'antd';
import RoleApi from '@/services/Role';

export default {
  namespace: 'role',
  state: {
    paging: null,
    detail: null,
    all: [],
  },
  effects: {
    * getAll({ payload = {} }, { call, put }) {
      let result = yield RoleApi.getAll(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      yield put({
        type: 'fillAll',
        payload: result.data,
      });
    },
    * paging({ payload = {} }, { call, put }) {
      let result = yield RoleApi.paging(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      yield put({
        type: 'fillPaging',
        payload: result.data,
      });
    },
    * getOne({ payload = {} }, { call, put }) {
      let result = yield RoleApi.getOne(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      yield put({
        type: 'fillDetail',
        payload: result.data,
      });
    },
    * insert({ payload = {}, callback }, { call, put }) {
      let result = yield RoleApi.insert(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      if (callback) {
        callback();
      }
    },
    * grantAuthority({ payload = {}, callback }, { call, put }) {
      let result = yield RoleApi.grantAuthority(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      if (callback) {
        callback();
      }
    },
    * update({ payload = {}, callback }, { call, put }) {
      let result = yield RoleApi.update(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      if (callback) {
        callback();
      }
    },
    * delete({ payload = {}, callback }, { call, put }) {
      let result = yield RoleApi.delete(payload);
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
