import * as types from './types';

import constants from './../constants';

export function autoLogin() {
  // Set temporary token

  // localStorage.setItem(
  //   constants.MACHADALO_LOCAL_STORAGE_CREDENTIALS_KEY,
  //   '{"username":"mdadmin","user_id":107,"name":"Admin","user_code":"0","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1kYWRtaW4iLCJvcmlnX2lhdCI6MTU0MDQ1MTU5NSwibmFtZSI6IkFkbWluIiwiZXhwIjoxNTQwNDUxODk1LCJ1c2VyX2lkIjoxMDcsImVtYWlsIjoiYWRtaW5AbWFjaGFkYWxvLmNvbSJ9.oPeM1QtnbYHaKuky7fKYP2dCNI9DsM0tC4byBMCso58","email":"admin@machadalo.com"}'
  // );

  // Fetch token from local storage
  const credentials = JSON.parse(
    localStorage.getItem(constants.MACHADALO_LOCAL_STORAGE_CREDENTIALS_KEY)
  );
  const token = localStorage.getItem(constants.MACHADALO_LOCAL_STORAGE_TOKEN_KEY);
  // const token =
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1kYWRtaW4iLCJvcmlnX2lhdCI6MTU0MDk4ODUyNSwibmFtZSI6IkFkbWluIiwiZXhwIjoxNTQwOTg4ODI1LCJ1c2VyX2lkIjoxMDcsImVtYWlsIjoiYWRtaW5AbWFjaGFkYWxvLmNvbSJ9.hRBcH9Xq8w4UA4_X4UiMKp1R51GL4s7MqA6sH1dJZts';

  if (credentials && credentials.token) {
    return (dispatch) => {
      dispatch(postLoginSuccess({ token: credentials.token }));
    };
  } else if (token) {
    return (dispatch) => {
      dispatch(postLoginSuccess({ token }));
    };
  } else {
    return (dispatch) => {
      console.log('User not authorized. Redirecting to login...');
      // dispatch(doLogout());
    };
  }
}

export function postLoginStart() {
  return {
    type: types.LOGIN_START,
  };
}

export function postLoginSuccess({ token }) {
  // Save token in local storage
  localStorage.setItem(constants.MACHADALO_LOCAL_STORAGE_TOKEN_KEY, token);

  return {
    type: types.LOGIN_SUCCESS,
    token,
  };
}

export function postLoginFail() {
  return {
    type: types.LOGIN_FAIL,
  };
}

export function doLogout() {
  // Clear token in local storage
  localStorage.setItem(constants.MACHADALO_LOCAL_STORAGE_TOKEN_KEY, '');

  return {
    type: types.USER_LOGOUT,
  };
}
