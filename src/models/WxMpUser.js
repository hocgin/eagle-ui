import UiUtils from '@/utils/UiUtils';
import WxMpUserApi from '@/services/WxMpUser';

export default {
  namespace: 'wxMpUser',
  state: {
    paging: null,
    detail: null,
    complete: [],
    all: [],
  },
  effects: {
    // 获取所有
    * getAll({ payload = {}, callback }, { call, put }) {
      let result = yield WxMpUserApi.getAll(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillAll', payload: result.data });
        if (callback) callback(result);
      }
    },
    // 分页查询
    * paging({ payload = {}, callback }, { call, put }) {
      let result = yield WxMpUserApi.paging(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillPaging', payload: result.data });
        if (callback) callback(result);
      }
    },
    // 查询
    * getComplete({ payload = {}, callback }, { call, put }) {
      let result = yield WxMpUserApi.getComplete(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillComplete', payload: result.data });
        if (callback) callback(result);
      }
    },
    // 详情
    * getOne({ payload = {}, callback }, { call, put }) {
      let result = yield WxMpUserApi.getOne(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillDetail', payload: result.data });
        if (callback) callback(result);
      }
    },
    // 刷新用户列表
    * refresh({ payload = {}, callback }, { call, put }) {
      let result = yield WxMpUserApi.refresh(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    // 新增
    * insert({ payload = {}, callback }, { call, put }) {

    },
    // 更新
    * update({ payload = {}, callback }, { call, put }) {

    },
    // 删除
    * delete({ payload = {}, callback }, { call, put }) {

    },
  },
  reducers: {
    fillComplete(state, { payload }) {
      return { ...state, complete: payload };
    },
    fillAll(state, { payload }) {
      return { ...state, all: payload };
    },
    fillPaging(state, { payload }) {
      return { ...state, paging: payload };
    },
    fillDetail(state, { payload }) {
      return { ...state, detail: payload };
    },
  },
  subscriptions: {},
};
