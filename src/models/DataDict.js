import qs from 'query-string';
import Utils from '@/utils/utils';
import { message } from 'antd';
import DataDictApi from '@/services/DataDict';

export default {
  namespace: 'dataDict',
  state: {
    allPlatform: [],
    allAuthorityType: [],
  },
  effects: {
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
  },
  reducers: {
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