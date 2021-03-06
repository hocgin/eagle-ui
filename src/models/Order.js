import UiUtils from '@/utils/UiUtils';
import OrderApi from '@/services/Order';
import qs from 'query-string';
import { pathToRegexp } from 'path-to-regexp';
import ChangeLogApi from '@/services/ChangeLog';

export default {
  namespace: 'order',
  state: {
    paging: null,
    detail: null,
    all: [],
    changeLogPaging: null,
  },
  effects: {
    // 获取所有
    * getAll({ payload = {}, callback }, { call, put }) {
      let result = {}; // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillAll', payload: result.data });
        if (callback) callback(result);
      }
    },
    // 分页查询
    * paging({ payload = {}, callback }, { call, put }) {
      let result = yield OrderApi.paging(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillPaging', payload: result.data });
        if (callback) callback(result);
      }
    },
    // 详情
    * getOne({ payload = {}, callback }, { call, put }) {
      let result = yield OrderApi.getOne(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillDetail', payload: result.data });
        if (callback) callback(result);
      }
    },
    // 新增
    * insert({ payload = {}, callback }, { call, put }) {

    },
    // 更新
    * update({ payload = {}, callback }, { call, put }) {
      let result = yield OrderApi.update(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    // 删除
    * delete({ payload = {}, callback }, { call, put }) {
      let result = yield OrderApi.delete(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    // 关闭
    * close({ payload = {}, callback }, { call, put }) {
      let result = yield OrderApi.close(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    // 发货
    * shipped({ payload = {}, callback }, { call, put }) {
      let result = yield OrderApi.shipped(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    * pagingChangeLog({ payload: { id, ...payload }, callback }, { call, put }) {
      let result = yield ChangeLogApi.paging({ ...payload, refId: id, refType: 0 }); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillChangeLogPaging', payload: result.data });
        if (callback) callback(result);
      }
    },
  },
  reducers: {
    fillChangeLogPaging(state, { payload }) {
      return {
        ...state,
        changeLogPaging: payload,
      };
    },
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
  subscriptions: {
    setup({ dispatch, history }, done) {
      return history.listen(({ pathname, search }) => {
        const query = qs.parse(search);
        // 订单详情
        if (pathToRegexp('/oms/order/:id').test(pathname)) {
          let index = pathname.lastIndexOf('/');
          let id = pathname.substr(index + 1);
          dispatch({ type: 'getOne', payload: { id } });
          dispatch({ type: 'pagingChangeLog', payload: { id } });
        }
      });
    },
  },
};
