import UiUtils from '@/utils/UiUtils';
import WxMpMenuApi from '@/services/WxMpMenu';
import qs from 'query-string';
import { pathToRegexp } from 'path-to-regexp';

export default {
  namespace: 'wxMpMenu',
  state: {
    paging: null,
    detail: null,
    all: [],
  },
  effects: {
    // 获取所有
    * getAll({ payload = {}, callback }, { call, put }) {
      let result = yield WxMpMenuApi.getAll(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillAll', payload: result.data });
        if (callback) callback(result);
      }
    },
    // 分页查询
    * paging({ payload = {}, callback }, { call, put }) {
      let result = yield WxMpMenuApi.paging(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillPaging', payload: result.data });
        if (callback) callback(result);
      }
    },
    // 详情
    * getOne({ payload = {}, callback }, { call, put }) {
      let result = yield WxMpMenuApi.getOne(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillDetail', payload: result.data });
        if (callback) callback(result);
      }
    },
    // 新增
    * insert({ payload = {}, callback }, { call, put }) {
      let result = yield WxMpMenuApi.insert(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    // 更新
    * update({ payload = {}, callback }, { call, put }) {
      let result = yield WxMpMenuApi.update(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    // 删除
    * delete({ payload = {}, callback }, { call, put }) {

    },
    * sync({ payload = {}, callback }, { call, put }) {
      let result = yield WxMpMenuApi.sync(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
  },
  reducers: {
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
  subscriptions: {
    setup({ dispatch, history }, done) {
      return history.listen(({ pathname, search }) => {
        const query = qs.parse(search);
        // 订单详情
        if (pathToRegexp('/wx/mp-menu/:id(\\d+)').test(pathname)) {
          let index = pathname.lastIndexOf('/');
          let id = pathname.substr(index + 1);
          dispatch({ type: 'getOne', payload: { id } });
        }
      });
    },
  },
};
