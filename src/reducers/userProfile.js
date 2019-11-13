import createReducer from './../lib/createReducer';
import * as types from './../actions/types';

export const userProfile = createReducer(
  {
    userProfileList: []
  },

  {
    [types.GET_USER_PROFILE_LIST_START](state) {
      return Object.assign({}, state, {
        userProfileList: []
      });
    },
    [types.GET_USER_PROFILE_LIST_SUCCESS](state, action) {
      return Object.assign({}, state, {
        userProfileList: action.data
      });
    },
    [types.GET_USER_PROFILE_LIST_FAIL](state) {
      return Object.assign({}, state, {
        userProfileList: []
      });
    }
  }
);

export { userProfile as default };
