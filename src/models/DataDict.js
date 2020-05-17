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
    allCouponType: [],
    allCouponPlatformType: [],
    allCouponUseType: [],
    allGroupMemberSource: [],
    allAccountGroupType: [],
    allWxMenuType: [],
    allWxMpMaterialType: [],
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
    * getAllCouponType({ payload = {}, callback }, { call, put }) {
      let result = yield DataDictApi.getAllDataDict({ code: 'couponType' });
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillAllCouponType', payload: result.data });
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
    * getAllCouponPlatformType({ payload = {}, callback }, { call, put }) {
      let result = yield DataDictApi.getAllDataDict({ code: 'couponPlatformType' });
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillAllCouponPlatformType', payload: result.data });
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
    * getAllCouponUseType({ payload = {}, callback }, { call, put }) {
      let result = yield DataDictApi.getAllDataDict({ code: 'couponUseType' });
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillData', payload: { field: 'allCouponUseType', data: result.data } });
        if (callback) callback(result);
      }
    },
    * getAllWxMenuType({ payload = {}, callback }, { call, put }) {
      let result = yield DataDictApi.getAllDataDict({ code: 'wxMenuType' });
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillData', payload: { field: 'allWxMenuType', data: result.data } });
        if (callback) callback(result);
      }
    },
    * getAllWxMpMaterialType({ payload = {}, callback }, { call, put }) {
      let result = yield DataDictApi.getAllDataDict({ code: 'wxMaterialType' });
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillData', payload: { field: 'allWxMpMaterialType', data: result.data } });
        if (callback) callback(result);
      }
    },
    * getAllGroupMemberSource({ payload = {}, callback }, { call, put }) {
      let result = yield DataDictApi.getAllDataDict({ code: 'groupMemberSource' });
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillData', payload: { field: 'allGroupMemberSource', data: result.data } });
        if (callback) callback(result);
      }
    },
    * getAllAccountGroupType({ payload = {}, callback }, { call, put }) {
      let result = yield DataDictApi.getAllDataDict({ code: 'accountGroupType' });
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillData', payload: { field: 'allAccountGroupType', data: result.data } });
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
    fillData(state, { payload: { field, data } }) {
      return { ...state, [field]: data };
    },
    fillAllPlatform(state, { payload }) {
      return {
        ...state,
        allPlatform: payload,
      };
    },
    fillAllCouponPlatformType(state, { payload }) {
      return {
        ...state,
        allCouponPlatformType: payload,
      };
    },
    fillAllCouponType(state, { payload }) {
      return {
        ...state,
        allCouponType: payload,
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
