import API from '@/api/api';
import { message } from 'antd';
import qs from "query-string";

export default {
  namespace: 'tpl',
  state: {
  },
  effects: {
    * findAll({ payload }, { call, put }) {
    },
  },
  reducers: {
    fillAll(state, { payload }) {
      return {
        ...state,
        all: payload
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }, done) {
      return history.listen(({ pathname, search }) => {
        const query = qs.parse(search);
        switch (pathname) {
          default:{
            console.log(pathname);
          }
        }
      });
    },
  },
};