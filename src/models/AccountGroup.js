import UiUtils from '@/utils/UiUtils';
import AccountGroupApi from '@/services/AccountGroup';
import qs from 'query-string';
import pathToRegexp from 'path-to-regexp';

export default {
  namespace: 'accountGroup',
  state: {
    paging: null,
    pagingMembers: null,
    detail: null,
    all: [],
  },
  effects: {
    // 分页查询
    * paging({ payload = {}, callback }, { call, put }) {
      let result = yield AccountGroupApi.paging(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillPaging', payload: result.data });
        if (callback) callback(result);
      }
    },
    // 详情
    * getOne({ payload = {}, callback }, { call, put }) {
      let result = yield AccountGroupApi.getOne(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillDetail', payload: result.data });
        if (callback) callback(result);
      }
    },
    // 新增
    * insert({ payload = {}, callback }, { call, put }) {
      let result = yield AccountGroupApi.insert(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    // 更新
    * update({ payload = {}, callback }, { call, put }) {
      let result = yield AccountGroupApi.update(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    // 删除
    * delete({ payload = {}, callback }, { call, put }) {
      let result = yield AccountGroupApi.delete(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    // 加入群员
    * joinMember({ payload = {}, callback }, { call, put }) {
      let result = yield AccountGroupApi.joinWithMember(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    // 群员分页
    * pagingWithMember({ payload = {}, callback }, { call, put }) {
      let result = yield AccountGroupApi.pagingWithMember(payload);
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillPagingMembers', payload: result.data });
        if (callback) callback(result);
      }
    },
    // 移除群员
    * deleteWithMember({ payload = {}, callback }, { call, put }) {
      let result = yield AccountGroupApi.deleteWithMember(payload);
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
    fillPagingMembers(state, { payload }) {
      return { ...state, pagingMembers: payload };
    },
    fillDetail(state, { payload }) {
      return { ...state, detail: payload };
    },
  },
  subscriptions: {
    setup({ dispatch, history }, done) {
      return history.listen(({ pathname, search }) => {
        const query = qs.parse(search);
        if (pathToRegexp('/ums/group/:id').test(pathname)) {
          let index = pathname.lastIndexOf('/');
          let id = pathname.substr(index + 1);
          dispatch({ type: 'getOne', payload: { id } });
          dispatch({ type: 'pagingWithMember', payload: { groupId: id } });
        }
      });
    },
  },
};
