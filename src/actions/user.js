import request from 'superagent';

import * as types from './types';

import config from './../config';

//User List
export function getUsersListStart() {
  return {
    type: types.GET_USERS_LIST_START
  };
}

export function getUsersListSuccess(users) {
  return {
    type: types.GET_USERS_LIST_SUCCESS,
    data: users
  };
}

export function getUsersListFail() {
  return {
    type: types.GET_USERS_LIST_FAIL
  };
}

export function getUsersList() {
  return (dispatch, getState) => {
    dispatch(getUsersListStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/users/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then(resp => {
        dispatch(getUsersListSuccess(resp.body.data));
      })
      .catch(ex => {
        console.log('Failed to fetch list of users', ex);

        dispatch(getUsersListFail());
      });
  };
}

//User
export function getCurrentUserStart() {
  return {
    type: types.GET_CURRENT_USER_START
  };
}

export function getCurrentUserSuccess(user) {
  return {
    type: types.GET_CURRENT_USER_SUCCESS,
    data: user
  };
}

export function getCurrentUserFail() {
  return {
    type: types.GET_CURRENT_USER_FAIL
  };
}

export function getCurrentUser() {
  return (dispatch, getState) => {
    dispatch(getCurrentUserStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/users/self/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then(resp => {
        dispatch(getCurrentUserSuccess(resp.body.data));
      })
      .catch(ex => {
        console.log('Failed to fetch list of users', ex);

        dispatch(getCurrentUserFail());
      });
  };
}
