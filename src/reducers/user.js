import createReducer from './../lib/createReducer';
import * as types from './../actions/types';

export const user = createReducer(
  {
    userList: [],
    currentUser: undefined,
  },

  {
    [types.GET_USERS_LIST_START](state) {
      return Object.assign({}, state, {
        isFetchingUserList: true,
        userList: [],
      });
    },
    [types.GET_USERS_LIST_SUCCESS](state, action) {
      return Object.assign({}, state, {
        isFetchingUserList: false,
        userList: action.data,
      });
    },
    [types.GET_USERS_LIST_FAIL](state) {
      return Object.assign({}, state, {
        isFetchingUserList: false,
        userList: [],
      });
    },
    [types.GET_CURRENT_USER_START](state) {
      return Object.assign({}, state, {
        userList: [],
      });
    },
    [types.GET_CURRENT_USER_SUCCESS](state, action) {
      return Object.assign({}, state, {
        currentUser: action.data,
      });
    },
    [types.GET_CURRENT_USER_FAIL](state) {
      return Object.assign({}, state, {
        userList: [],
      });
    },
  }
);

export { user as default };
