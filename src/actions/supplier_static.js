import request from 'superagent';

import * as types from './types';

import config from '../config';

//Supplier List
export function getSuppliersListStart() {
  return {
    type: types.GET_SUPPLIERS_STATIC_LIST_START,
  };
}

export function getSuppliersListSuccess({ suppliers }) {
  return {
    type: types.GET_SUPPLIERS_STATIC_LIST_SUCCESS,
    suppliers,
  };
}

export function getSuppliersListFail() {
  return {
    type: types.GET_SUPPLIERS_STATIC_LIST_FAIL,
  };
}

export function getSuppliersList({ campaignProposalId }) {
  return (dispatch, getState) => {
    dispatch(getSuppliersListStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/website/proposal/${campaignProposalId}/shortlisted_suppliers/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        let suppliers = [];
        const data = resp.body.data;
        const dataKeys = Object.keys(data);
        if (dataKeys.indexOf('dynamic_suppliers') > 0) {
          dataKeys.splice(dataKeys.indexOf('dynamic_suppliers'), 1);
        }

        for (let i = 0, l = dataKeys.length; i < l; i += 1) {
          const supplierGroups = data[dataKeys[i]].suppliers;
          const supplierGroupsKeys = Object.keys(supplierGroups);

          for (let j = 0, sl = supplierGroupsKeys.length; j < sl; j += 1) {
            suppliers = suppliers.concat(supplierGroups[supplierGroupsKeys[j]]);
          }
        }
        if (data.dynamic_suppliers.length) {
          suppliers = suppliers.concat(data.dynamic_suppliers);
        }
        dispatch(getSuppliersListSuccess({ suppliers }));
      })
      .catch((ex) => {
        console.log('Failed to fetch list of suppliers', ex);

        dispatch(getSuppliersListFail());
      });
  };
}

//Current Supplier

export function getCurrentSupplierStart() {
  return {
    type: types.GET_CURRENT_SUPPLIER_START,
  };
}

export function getCurrentSupplierSuccess({ currentSupplier }) {
  return {
    type: types.GET_CURRENT_SUPPLIER_SUCCESS,
    currentSupplier,
  };
}

export function getCurrentSupplierFail() {
  return {
    type: types.GET_CURRENT_SUPPLIER_FAIL,
  };
}

export function getCurrentSupplier(supplierId) {
  return (dispatch, getState) => {
    dispatch(getCurrentSupplierStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/website/supplier-details/`)
      .query({ supplier_id: supplierId, supplier_type_code: 'RS' })
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        dispatch(getCurrentSupplierSuccess({ currentSupplier: resp.body.data }));
      })
      .catch((ex) => {
        console.log('Failed to fetch list of cuurent supplier', ex);

        dispatch(getCurrentSupplierFail());
      });
  };
}
