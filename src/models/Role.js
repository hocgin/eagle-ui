import RoleApi from '@/services/Role';
import UiUtils from '@/utils/UiUtils';

export default {
  namespace: 'role',
  state: {
    paging: null,
    detail: null,
    all: [],
  },
  effects: {
    * getAll({ payload = {}, callback }, { call, put }) {
      let result = yield RoleApi.getAll(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillAll', payload: result.data });
        if (callback) callback(result);
      }
    },
    * paging({ payload = {}, callback }, { call, put }) {
      let result = yield RoleApi.paging(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillPaging', payload: result.data });
        if (callback) callback(result);
      }
    },
    * getOne({ payload = {}, callback }, { call, put }) {
      let result = yield RoleApi.getOne(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillDetail', payload: result.data });
        if (callback) callback(result);
      }
    },
    * insert({ payload = {}, callback }, { call, put }) {
      let result = yield RoleApi.insert(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    * grantAuthority({ payload = {}, callback }, { call, put }) {
      let result = yield RoleApi.grantAuthority(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    * update({ payload = {}, callback }, { call, put }) {
      let result = yield RoleApi.update(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    * delete({ payload = {}, callback }, { call, put }) {
      let result = yield RoleApi.delete(payload);
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
