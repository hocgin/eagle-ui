import Utils from '@/utils/utils';
import { message } from 'antd';
import DataDictItemApi from '@/services/DataDictItem';
import UiUtils from '@/utils/UiUtils';

export default {
  namespace: 'dataDictItem',
  state: {
    paging: null,
    detail: null,
  },
  effects: {
    * insert({ payload = {}, callback }, { call, put }) {
      let result = yield DataDictItemApi.insert(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    * getOne({ payload = {}, callback }, { call, put }) {
      let result = yield DataDictItemApi.getOne(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillDetail', payload: result.data });
        if (callback) callback(result);
      }
    },
    * update({ payload = {}, callback }, { call, put }) {
      let result = yield DataDictItemApi.update(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    * deletes({ payload = {}, callback }, { call, put }) {
      let result = yield DataDictItemApi.deletes(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
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
