import AuthorityApi from '@/services/Authority';
import UiUtils from '@/utils/UiUtils';

export default {
  namespace: 'authority',
  state: {
    all: [],
    authorityTree: [],
    detail: null,
  },
  effects: {
    * getAllAuthority({ payload = {}, callback }, { call, put }) {
      let result = yield AuthorityApi.getAll(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillAll', payload: result.data });
        if (callback) callback(result);
      }
    },
    * getAuthorityTree({ payload = {}, callback }, { call, put }) {
      let result = yield AuthorityApi.getAuthorityTree(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillAuthorityTree', payload: result.data });
        if (callback) callback(result);
      }
    },
    * getAuthority({ payload = {}, callback }, { call, put }) {
      let result = yield AuthorityApi.getOne(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillDetail', payload: result.data });
        if (callback) callback(result);
      }
    },
    * insertOne({ payload = {}, callback }, { call, put }) {
      let result = yield AuthorityApi.insert(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    * updateOne({ payload = {}, callback }, { call, put }) {
      let result = yield AuthorityApi.update(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    * delete({ payload = {}, callback }, { call, put }) {
      let result = yield AuthorityApi.delete(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    * grantRole({ payload = {}, callback }, { call, put }) {
      let result = yield AuthorityApi.grantRole(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
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
