import UiUtils from '@/utils/UiUtils';
import OrderApi from '@/services/Order';
import qs from 'query-string';

export default {
  namespace: 'order',
  state: {
    paging: null,
    detail: null,
    all: [],
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
  subscriptions: {
    setup({ dispatch, history }, done) {
      return history.listen(({ pathname, search }) => {
        const query = qs.parse(search);
        // 订单详情
        if (new RegExp('^/oms/order/\\d?\\d$').test(`${pathname}`)) {
          let index = pathname.lastIndexOf('/');
          let id = pathname.substr(index + 1);
          console.log('id', id);
          dispatch({
            type: 'getOne',
            payload: {
              id,
            },
          });
        }
      });
    },
  },
};
