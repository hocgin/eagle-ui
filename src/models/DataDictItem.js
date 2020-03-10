import Utils from '@/utils/utils';
import { message } from 'antd';
import DataDictItemApi from '@/services/DataDictItem';

export default {
  namespace: 'dataDictItem',
  state: {
    paging: null,
    detail: null,
  },
  effects: {
    * insert({ payload, callback }, { call, put }) {
      let result = yield DataDictItemApi.insert(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      if (callback) {
        callback();
      }
    },
    * getOne({ payload }, { call, put }) {
      let result = yield DataDictItemApi.getOne(payload);
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
      let result = yield DataDictItemApi.update(payload);
      if (!Utils.isSuccess(result)) {
        message.error(result.message);
        return;
      }
      if (callback) {
        callback();
      }
    },
    * deletes({ payload, callback }, { call, put }) {
      let result = yield DataDictItemApi.deletes(payload);
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
    fillDetail(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
  },
  subscriptions: {},
};
