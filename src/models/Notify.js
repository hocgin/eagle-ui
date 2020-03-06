export default {
  namespace: 'tpl',
  state: {},
  effects: {
    * findAll({ payload = {} }, { call, put }) {
    },
  },
  reducers: {
    fillAll(state, { payload }) {
      return {
        ...state,
        all: payload,
      };
    },
  },
  subscriptions: {},
};
