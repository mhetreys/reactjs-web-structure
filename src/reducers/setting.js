import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

export const settings = createReducer(
  {
    permissionList: [],
    profilePermission: [],
    currentProfilePermissionId: undefined,
    loggedInChecklistPermission: {}
  },

  {
    [types.GET_PERMISSION_LIST_START](state) {
      return Object.assign({}, state, {
        permissionList: []
      });
    },
    [types.GET_PERMISSION_LIST_SUCCESS](state, action) {
      return Object.assign({}, state, {
        permissionList: action.data
      });
    },
    [types.GET_PERMISSION_LIST_FAIL](state) {
      return Object.assign({}, state, {
        permissionList: []
      });
    },
    [types.GET_USER_PERMISSION_START](state) {
      return Object.assign({}, state, {
        profilePermission: [],
        currentProfilePermissionId: undefined
      });
    },
    [types.GET_USER_PERMISSION_SUCCESS](state, action) {
      return Object.assign({}, state, {
        profilePermission: action.profilePermission,
        currentProfilePermissionId: action.currentProfilePermissionId
      });
    },
    [types.GET_USER_PERMISSION_FAIL](state) {
      return Object.assign({}, state, {
        profilePermission: [],
        currentProfilePermissionId: undefined
      });
    },
    [types.GET_LOGGED_IN_USER_PERMISSION_START](state) {
      return Object.assign({}, state, {
        loggedInChecklistPermission: {}
      });
    },
    [types.GET_LOGGED_IN_USER_PERMISSION_SUCCESS](state, action) {
      return Object.assign({}, state, {
        loggedInChecklistPermission: action.loggedInChecklistPermission
      });
    },
    [types.GET_LOGGED_IN_USER_PERMISSION_FAIL](state) {
      return Object.assign({}, state, {
        loggedInChecklistPermission: {}
      });
    }
  }
);

export { settings as default };
