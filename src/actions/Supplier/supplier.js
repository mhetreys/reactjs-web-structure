import request from 'superagent';

import * as types from '../types';

import config from '../../config';

//Post Supplier
export function postSupplierStart() {
  return {
    type: types.POST_SUPPLIER_START,
  };
}

export function postSupplierSuccess(supplier) {
  return {
    type: types.POST_SUPPLIER_SUCCESS,
    data: supplier,
  };
}

export function postSupplierFail() {
  return {
    type: types.POST_SUPPLIER_FAIL,
  };
}

export function postSupplier({ data }, callback) {
  return (dispatch, getState) => {
    dispatch(postSupplierStart());

    const { auth } = getState();

    request
      .post(`${config.API_URL}/v0/ui/dynamic-suppliers/supplier/`)
      .set('Authorization', `JWT ${auth.token}`)
      .send(data)
      .then((resp) => {
        dispatch(postSupplierSuccess(resp.data));
        if (callback) {
          callback();
        }
      })
      .catch((ex) => {
        console.log('Failed to create supplier', ex);
        dispatch(postSupplierFail());
      });
  };
}

//Get Supplier List
export function getSupplierListStart() {
  return {
    type: types.GET_SUPPLIER_LIST_START,
  };
}

export function getSupplierListSuccess(supplierList) {
  return {
    type: types.GET_SUPPLIER_LIST_SUCCESS,
    data: supplierList,
  };
}

export function getSupplierListFail() {
  return {
    type: types.GET_SUPPLIER_LIST_FAIL,
  };
}

export function getSupplierList() {
  return (dispatch, getState) => {
    dispatch(getSupplierListStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/dynamic-suppliers/supplier/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        dispatch(getSupplierListSuccess(Object.values(resp.body.data)));
      })
      .catch((ex) => {
        console.log('Failed to fetch supplier', ex);

        dispatch(getSupplierListFail());
      });
  };
}

//Delete Supplier
export function deleteSupplierStart() {
  return {
    type: types.DELETE_SUPPLIER_START,
  };
}

export function deleteSupplierSuccess(supplierId) {
  return {
    type: types.DELETE_SUPPLIER_SUCCESS,
    supplierId,
  };
}

export function deleteSupplierFail() {
  return {
    type: types.DELETE_SUPPLIER_FAIL,
  };
}

export function deleteSupplier(supplierId, callback) {
  return (dispatch, getState) => {
    dispatch(deleteSupplierStart());

    const { auth } = getState();

    request
      .delete(`${config.API_URL}/v0/ui/dynamic-suppliers/supplier/${supplierId}/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        dispatch(deleteSupplierSuccess(supplierId));
        dispatch(getSupplierList());
        callback();
      })
      .catch((ex) => {
        console.log('Failed to delete supplier', ex);

        dispatch(deleteSupplierFail());
      });
  };
}

//Get Current Supplier
export function getSupplierStart() {
  return {
    type: types.GET_CURRENT_SUPPLIER_START,
  };
}

export function getSupplierSuccess(supplier) {
  return {
    type: types.GET_CURRENT_SUPPLIER_SUCCESS,
    data: supplier,
  };
}

export function getSupplierFail() {
  return {
    type: types.GET_CURRENT_SUPPLIER_FAIL,
  };
}

export function getSupplier(supplierId) {
  return (dispatch, getState) => {
    dispatch(getSupplierStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/dynamic-suppliers/supplier/${supplierId}/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        dispatch(getSupplierSuccess(resp.body.data));
      })
      .catch((ex) => {
        console.log('Failed to fetch supplier', ex);

        dispatch(getSupplierFail());
      });
  };
}

//Update Supplier

export function updateSupplier({ data, supplierId }, callback) {
  return (dispatch, getState) => {
    dispatch(postSupplierStart());

    const { auth } = getState();

    request
      .put(`${config.API_URL}/v0/ui/dynamic-suppliers/supplier/${supplierId}/`)
      .set('Authorization', `JWT ${auth.token}`)
      .send(data)
      .then((resp) => {
        dispatch(postSupplierSuccess(resp.data));
        if (callback) {
          callback();
        }
      })
      .catch((ex) => {
        console.log('Failed to create supplier', ex);
        dispatch(postSupplierFail());
      });
  };
}
