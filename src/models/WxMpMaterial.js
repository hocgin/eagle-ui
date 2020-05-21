import UiUtils from '@/utils/UiUtils';
import WxMpMaterialApi from '@/services/WxMpMaterial';

export default {
  namespace: 'wxMpMaterial',
  state: {
    paging: null,
    detail: null,
    all: [],
  },
  effects: {
    // 获取所有
    * getAll({ payload = {}, callback }, { call, put }) {
      let result = yield WxMpMaterialApi.getAll(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillAll', payload: result.data });
        if (callback) callback(result);
      }
    },
    // 分页查询
    * paging({ payload = {}, callback }, { call, put }) {
      let result = yield WxMpMaterialApi.paging(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillPaging', payload: result.data });
        if (callback) callback(result);
      }
    },
    // 详情
    * getOne({ payload = {}, callback }, { call, put }) {
      let result = yield WxMpMaterialApi.getOne(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        yield put({ type: 'fillDetail', payload: result.data });
        if (callback) callback(result);
      }
    },
    // 新增
    * uploadNews({ payload = {}, callback }, { call, put }) {
      let result = yield WxMpMaterialApi.uploadNews(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    * uploadVoice({ payload = {}, callback }, { call, put }) {
      let result = yield WxMpMaterialApi.uploadVoice(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    * uploadVideo({ payload = {}, callback }, { call, put }) {
      let result = yield WxMpMaterialApi.uploadVideo(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    // 更新
    * uploadImage({ payload = {}, callback }, { call, put }) {
      let result = yield WxMpMaterialApi.uploadImage(payload); // API
      if (UiUtils.showErrorMessageIfExits(result)) {
        if (callback) callback(result);
      }
    },
    // 删除
    * delete({ payload = {}, callback }, { call, put }) {

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
  subscriptions: {},
};
