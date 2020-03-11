import qs from 'query-string';
import DataDictApi from '@/services/DataDict';
import UiUtils from '@/utils/UiUtils';

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
    * paging({ payload = {}, callback }, { call, put }) {
      let result = yield DataDictApi.paging(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillPaging', payload: result.data });
        if (callback) callback(result);
      }
    },
    * insert({ payload = {}, callback }, { call, put }) {
      let result = yield DataDictApi.insert(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    * getOne({ payload = {}, callback }, { call, put }) {
      let result = yield DataDictApi.getOne(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillDetail', payload: result.data });
        if (callback) callback(result);
      }
    },
    * update({ payload = {}, callback }, { call, put }) {
      let result = yield DataDictApi.update(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    * deletes({ payload = {}, callback }, { call, put }) {
      let result = yield DataDictApi.deletes(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    * getAllPlatform({ payload = {}, callback }, { call, put }) {
      let result = yield DataDictApi.getAllDataDict({ code: 'platform' });
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillAllPlatform', payload: result.data });
        if (callback) callback(result);
      }
    },
    * getAllAuthorityType({ payload = {}, callback }, { call, put }) {
      let result = yield DataDictApi.getAllDataDict({ code: 'authorityType' });
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillAllAuthorityType', payload: result.data });
        if (callback) callback(result);
      }
    },
    * getAllEnabled({ payload = {}, callback }, { call, put }) {
      let result = yield DataDictApi.getAllDataDict({ code: 'enabled' });
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillAllEnabled', payload: result.data });
        if (callback) callback(result);
      }
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
