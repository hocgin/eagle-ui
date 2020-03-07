import qs from 'query-string';

export default {
  namespace: 'notifications',
  state: {
    query: {},
  },
  effects: {},
  reducers: {
    fillQuery(state, { payload }) {
      return {
        ...state,
        query: payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }, done) {
      return history.listen(({ pathname, search }) => {
        const query = qs.parse(search);
        if (`${pathname}` === '/account/notifications') {
          dispatch({
            type: 'fillQuery',
            payload: query || {},
          });
        }
      });
    },
  },
};
