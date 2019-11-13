import request from 'superagent';

import * as types from '../types';

import config from '../../config';

//Post BaseSupplier Type
export function postBaseSupplierTypeStart() {
  return {
    type: types.POST_BASE_SUPPLIER_TYPE_START,
  };
}

export function postBaseSupplierTypeSuccess(baseSupplier) {
  return {
    type: types.POST_BASE_SUPPLIER_TYPE_SUCCESS,
    data: baseSupplier,
  };
}

export function postBaseSupplierTypeFail() {
  return {
    type: types.POST_BASE_SUPPLIER_TYPE_FAIL,
  };
}

export function postBaseSupplierType({ data }, callback) {
  return (dispatch, getState) => {
    dispatch(postBaseSupplierTypeStart());

    const { auth } = getState();

    request
      .post(`${config.API_URL}/v0/ui/dynamic-suppliers/base-supplier-type/`)
      .set('Authorization', `JWT ${auth.token}`)
      .send(data)
      .then((resp) => {
        dispatch(postBaseSupplierTypeSuccess(resp.data));
        if (callback) {
          callback();
        }
      })
      .catch((ex) => {
        console.log('Failed to create baseSupplier', ex);

        dispatch(postBaseSupplierTypeFail());
      });
  };
}

//Get BaseSupplier Type List
export function getBaseSupplierTypeListStart() {
  return {
    type: types.GET_BASE_SUPPLIER_TYPE_LIST_START,
  };
}

export function getBaseSupplierTypeListSuccess(baseSupplierTypeList) {
  return {
    type: types.GET_BASE_SUPPLIER_TYPE_LIST_SUCCESS,
    data: baseSupplierTypeList,
  };
}

export function getBaseSupplierTypeListFail() {
  return {
    type: types.GET_BASE_SUPPLIER_TYPE_LIST_FAIL,
  };
}

export function getBaseSupplierTypeList() {
  return (dispatch, getState) => {
    dispatch(getBaseSupplierTypeListStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/dynamic-suppliers/base-supplier-type/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        dispatch(getBaseSupplierTypeListSuccess(Object.values(resp.body.data)));
      })
      .catch((ex) => {
        console.log('Failed to fetch baseSupplier', ex);

        dispatch(getBaseSupplierTypeListFail());
      });
  };
}

//Delete BaseSupplier Type
export function deleteBaseSupplierTypeStart() {
  return {
    type: types.DELETE_BASE_SUPPLIER_TYPE_START,
  };
}

export function deleteBaseSupplierTypeSuccess(baseSupplierTypeId) {
  return {
    type: types.DELETE_BASE_SUPPLIER_TYPE_SUCCESS,
    baseSupplierTypeId,
  };
}

export function deleteBaseSupplierTypeFail() {
  return {
    type: types.DELETE_BASE_SUPPLIER_TYPE_FAIL,
  };
}

export function deleteBaseSupplierType(baseSupplierTypeId, callback) {
  return (dispatch, getState) => {
    dispatch(deleteBaseSupplierTypeStart());

    const { auth } = getState();

    request
      .delete(`${config.API_URL}/v0/ui/dynamic-suppliers/base-supplier-type/${baseSupplierTypeId}/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        dispatch(deleteBaseSupplierTypeSuccess(baseSupplierTypeId));
        dispatch(getBaseSupplierTypeList());
        callback();
      })
      .catch((ex) => {
        console.log('Failed to delete baseSupplier type', ex);

        dispatch(deleteBaseSupplierTypeFail());
      });
  };
}

//Get BaseSupplier Type List
export function getBaseSupplierTypeStart() {
  return {
    type: types.GET_CURRENT_BASE_SUPPLIER_TYPE_START,
  };
}

export function getBaseSupplierTypeSuccess(baseSupplierType) {
  return {
    type: types.GET_CURRENT_BASE_SUPPLIER_TYPE_SUCCESS,
    data: baseSupplierType,
  };
}

export function getBaseSupplierTypeFail() {
  return {
    type: types.GET_CURRENT_BASE_SUPPLIER_TYPE_FAIL,
  };
}

export function getBaseSupplierType(baseSupplierTypeId) {
  return (dispatch, getState) => {
    dispatch(getBaseSupplierTypeStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/dynamic-suppliers/base-supplier-type/${baseSupplierTypeId}/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        console.log(resp.body);
        dispatch(getBaseSupplierTypeSuccess(resp.body.data));
      })
      .catch((ex) => {
        console.log('Failed to fetch baseSupplier', ex);

        dispatch(getBaseSupplierTypeFail());
      });
  };
}

export function updateBaseSupplierType({ data, baseSupplierTypeId }, callback) {
  return (dispatch, getState) => {
    dispatch(postBaseSupplierTypeStart());

    const { auth } = getState();

    request
      .put(`${config.API_URL}/v0/ui/dynamic-suppliers/base-supplier-type/${baseSupplierTypeId}/`)
      .set('Authorization', `JWT ${auth.token}`)
      .send(data)
      .then((resp) => {
        dispatch(postBaseSupplierTypeSuccess(resp.data));
        if (callback) {
          callback();
        }
      })
      .catch((ex) => {
        console.log('Failed to create baseSupplier', ex);

        dispatch(postBaseSupplierTypeFail());
      });
  };
}
