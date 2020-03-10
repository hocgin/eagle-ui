import qs from 'query-string';
import Utils from '@/utils/utils';
import { message } from 'antd';
import DataDictApi from '@/services/DataDict';

export default {
  namespace: 'dataDict',
  state: {
    paging: null,
    detail: null,
    allPlatform: [],
    allAuthorityType: [],
    allEnabled: [],
  },
  effects: {
    * paging({ payload }, { call, put }) {
      let result = yield DataDictApi.paging(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      yield put({
        type: 'fillPaging',
        payload: result.data,
      });
    },
    * insert({ payload, callback }, { call, put }) {
      let result = yield DataDictApi.insert(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      if (callback) {
        callback();
      }
    },
    * getOne({ payload }, { call, put }) {
      let result = yield DataDictApi.getOne(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      yield put({
        type: 'fillDetail',
        payload: result.data,
      });
    },
    * update({ payload, callback }, { call, put }) {
      let result = yield DataDictApi.update(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      if (callback) {
        callback();
      }
    },
    * deletes({ payload, callback }, { call, put }) {
      let result = yield DataDictApi.deletes(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      if (callback) {
        callback();
      }
    },
    * getAllPlatform({ payload }, { call, put }) {
      let result = yield DataDictApi.getAllDataDict({ code: 'platform' });
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      yield put({
        type: 'fillAllPlatform',
        payload: result.data,
      });
    },
    * getAllAuthorityType({ payload }, { call, put }) {
      let result = yield DataDictApi.getAllDataDict({ code: 'authorityType' });
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      yield put({
        type: 'fillAllAuthorityType',
        payload: result.data,
      });
    },
    * getAllEnabled({ payload }, { call, put }) {
      let result = yield DataDictApi.getAllDataDict({ code: 'enabled' });
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      yield put({
        type: 'fillAllEnabled',
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
    fillAllPlatform(state, { payload }) {
      return {
        ...state,
        allPlatform: payload,
      };
    },
    fillAllAuthorityType(state, { payload }) {
      return {
        ...state,
        allAuthorityType: payload,
      };
    },
    fillAllEnabled(state, { payload }) {
      return {
        ...state,
        allEnabled: payload,
      };
    },
    fillDetail(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }, done) {
      return history.listen(({ pathname, search }) => {
        const query = qs.parse(search);
        switch (pathname) {
          default: {
            console.log(pathname);
          }
        }
      });
    },
  },
};