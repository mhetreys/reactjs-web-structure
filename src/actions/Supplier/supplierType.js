import request from 'superagent';

import * as types from '../types';

import config from '../../config';

//Post Supplier Type
export function postSupplierTypeStart() {
  return {
    type: types.POST_SUPPLIER_TYPE_START,
  };
}

export function postSupplierTypeSuccess(supplier) {
  return {
    type: types.POST_SUPPLIER_TYPE_SUCCESS,
    data: supplier,
  };
}

export function postSupplierTypeFail() {
  return {
    type: types.POST_SUPPLIER_TYPE_FAIL,
  };
}

export function postSupplierType({ data }, callback) {
  return (dispatch, getState) => {
    dispatch(postSupplierTypeStart());

    const { auth } = getState();

    request
      .post(`${config.API_URL}/v0/ui/dynamic-suppliers/supplier-type/`)
      .set('Authorization', `JWT ${auth.token}`)
      .send(data)
      .then((resp) => {
        dispatch(postSupplierTypeSuccess(resp.data));
        if (callback) {
          callback();
        }
      })
      .catch((ex) => {
        console.log('Failed to create supplier', ex);

        dispatch(postSupplierTypeFail());
      });
  };
}

//Get Supplier Type List
export function getSupplierTypeListStart() {
  return {
    type: types.GET_SUPPLIER_TYPE_LIST_START,
  };
}

export function getSupplierTypeListSuccess(supplierTypeList) {
  return {
    type: types.GET_SUPPLIER_TYPE_LIST_SUCCESS,
    data: supplierTypeList,
  };
}

export function getSupplierTypeListFail() {
  return {
    type: types.GET_SUPPLIER_TYPE_LIST_FAIL,
  };
}

export function getSupplierTypeList() {
  return (dispatch, getState) => {
    dispatch(getSupplierTypeListStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/dynamic-suppliers/supplier-type/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        dispatch(getSupplierTypeListSuccess(Object.values(resp.body.data)));
      })
      .catch((ex) => {
        console.log('Failed to fetch supplier', ex);

        dispatch(getSupplierTypeListFail());
      });
  };
}

//Delete Supplier Type
export function deleteSupplierTypeStart() {
  return {
    type: types.DELETE_SUPPLIER_TYPE_START,
  };
}

export function deleteSupplierTypeSuccess(supplierTypeId) {
  return {
    type: types.DELETE_SUPPLIER_TYPE_SUCCESS,
    supplierTypeId,
  };
}

export function deleteSupplierTypeFail() {
  return {
    type: types.DELETE_SUPPLIER_TYPE_FAIL,
  };
}

export function deleteSupplierType(supplierTypeId, callback) {
  return (dispatch, getState) => {
    dispatch(deleteSupplierTypeStart());

    const { auth } = getState();

    request
      .delete(`${config.API_URL}/v0/ui/dynamic-suppliers/supplier-type/${supplierTypeId}/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        dispatch(deleteSupplierTypeSuccess(supplierTypeId));
        dispatch(getSupplierTypeList());
        callback();
      })
      .catch((ex) => {
        console.log('Failed to delete supplier type', ex);

        dispatch(deleteSupplierTypeFail());
      });
  };
}

//Get Supplier Type List
export function getSupplierTypeStart() {
  return {
    type: types.GET_CURRENT_SUPPLIER_TYPE_START,
  };
}

export function getSupplierTypeSuccess(supplierType) {
  return {
    type: types.GET_CURRENT_SUPPLIER_TYPE_SUCCESS,
    data: supplierType,
  };
}

export function getSupplierTypeFail() {
  return {
    type: types.GET_CURRENT_SUPPLIER_TYPE_FAIL,
  };
}

export function getSupplierType(supplierTypeId) {
  return (dispatch, getState) => {
    dispatch(getSupplierTypeStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/dynamic-suppliers/supplier-type/${supplierTypeId}/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        console.log(resp.body);
        dispatch(getSupplierTypeSuccess(resp.body.data));
      })
      .catch((ex) => {
        console.log('Failed to fetch supplier', ex);

        dispatch(getSupplierTypeFail());
      });
  };
}

export function updateSupplierType({ data, supplierTypeId }, callback) {
  return (dispatch, getState) => {
    dispatch(postSupplierTypeStart());

    const { auth } = getState();

    request
      .put(`${config.API_URL}/v0/ui/dynamic-suppliers/supplier-type/${supplierTypeId}/`)
      .set('Authorization', `JWT ${auth.token}`)
      .send(data)
      .then((resp) => {
        dispatch(postSupplierTypeSuccess(resp.data));
        if (callback) {
          callback();
        }
      })
      .catch((ex) => {
        console.log('Failed to create supplier', ex);

        dispatch(postSupplierTypeFail());
      });
  };
}
