import createReducer from './../lib/createReducer';
import * as types from './../actions/types';

export const auth = createReducer(
  {
    token: '',
    isLoggedIn: null
  },

  {
    [types.LOGIN_START](state) {
      return Object.assign({}, state, {
        isLoggedIn: null
      });
    },
    [types.LOGIN_SUCCESS](state, action) {
      return Object.assign({}, state, {
        isLoggedIn: true,
        token: action.token
      });
    },
    [types.LOGIN_FAIL](state) {
      return Object.assign({}, state, {
        isLoggedIn: false
      });
    }
  }
);

export { auth as default };
