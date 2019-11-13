import createReducer from './../lib/createReducer';
import * as types from './../actions/types';

export const appearance = createReducer(
  {
    isSidebarVisible: false
  },
  {
    [types.SIDEBAR_TOGGLE](state) {
      return Object.assign({}, state, {
        isSidebarVisible: !state.isSidebarVisible
      });
    }
  }
);

export { appearance as default };
