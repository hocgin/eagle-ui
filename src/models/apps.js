import qs from 'query-string';

export default {
  namespace: 'apps',
  state: {},
  effects: {},
  reducers: {},
  subscriptions: {
    setup({ dispatch, history }, done) {
      return history.listen(({ pathname, search }) => {
        const query = qs.parse(search);
        switch (pathname) {
          case '/login': {
            break;
          }
          default: {
            console.log(pathname);
          }
        }
      });
    },
  },
};