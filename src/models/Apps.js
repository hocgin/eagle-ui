import qs from 'query-string';
import { router } from 'umi';

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
          case '/dashboard': {
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