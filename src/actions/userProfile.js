import request from 'superagent';

import * as types from './types';

import config from './../config';

//User List
export function getUserProfileListStart() {
  return {
    type: types.GET_USER_PROFILE_LIST_START
  };
}

export function getUserProfileListSuccess(userProfile) {
  return {
    type: types.GET_USER_PROFILE_LIST_SUCCESS,
    data: userProfile
  };
}

export function getUserProfileListFail() {
  return {
    type: types.GET_USER_PROFILE_LIST_FAIL
  };
}

export function getUserProfileList() {
  return (dispatch, getState) => {
    dispatch(getUserProfileListStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/accounts/profiles/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then(resp => {
        dispatch(getUserProfileListSuccess(resp.body.data));
      })
      .catch(ex => {
        console.log('Failed to fetch list of userProfile', ex);

        dispatch(getUserProfileListFail());
      });
  };
}
