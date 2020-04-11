import UiUtils from '@/utils/UiUtils';
import CommentApi from '@/services/Comment';

export default {
  namespace: 'comment',
  state: {
    rootPaging: null,
    childPaging: {},
    detail: null,
  },
  effects: {
    // 分页查询 ROOT
    * pagingWithRootPaging({ payload = {}, callback }, { call, put }) {
      let result = yield CommentApi.pagingWithRootPaging(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillRootPaging', payload: result.data });
        if (callback) callback(result);
      }
    },
    // 分页查询 CHILD
    * pagingWithChildPaging({ payload = {}, callback }, { call, put }) {
      let result = yield CommentApi.pagingWithChildPaging(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({
          type: 'fillChildPaging', payload: {
            parentId: payload.parentId,
            data: result.data,
          },
        });
        if (callback) callback(result);
      }
    },
    // 详情
    * getOne({ payload = {}, callback }, { call, put }) {
      let result = {}; // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillDetail', payload: result.data });
        if (callback) callback(result);
      }
    },
    // 新增
    * insert({ payload = {}, callback }, { call, put }) {
      let result = yield CommentApi.insert(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    // 更新
    * update({ payload = {}, callback }, { call, put }) {

    },
    // 删除
    * delete({ payload = {}, callback }, { call, put }) {

    },
  },
  reducers: {
    fillRootPaging(state, { payload }) {
      return { ...state, rootPaging: payload };
    },
    fillChildPaging({ childPaging, ...state }, { payload: { parentId, data } }) {
      return {
        ...state, childPaging: {
          ...childPaging,
          [`ID_${parentId}`]: data,
        },
      };
    },
    fillDetail(state, { payload }) {
      return { ...state, detail: payload };
    },
  },
  subscriptions: {},
};
