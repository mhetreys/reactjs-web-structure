import request from 'superagent';

import * as types from './types';

import config from './../config';

//Post Supplier Type
export function postBaseInventoryStart() {
  return {
    type: types.POST_BASE_INVENTORY_START,
  };
}

export function postBaseInventorySuccess(baseInventory) {
  return {
    type: types.POST_BASE_INVENTORY_SUCCESS,
    data: baseInventory,
  };
}

export function postBaseInventoryFail() {
  return {
    type: types.POST_BASE_INVENTORY_FAIL,
  };
}

export function postBaseInventory({ data }, callback) {
  return (dispatch, getState) => {
    dispatch(postBaseInventoryStart());

    const { auth } = getState();

    request
      .post(`${config.API_URL}/v0/ui/dynamic-inventory/base-inventory/`)
      .set('Authorization', `JWT ${auth.token}`)
      .send(data)
      .then((resp) => {
        dispatch(postBaseInventorySuccess(resp.data));
        if (callback) {
          callback();
        }
      })
      .catch((ex) => {
        console.log('Failed to create base Inventory', ex);

        dispatch(postBaseInventoryFail());
      });
  };
}

//Get Base Inventory
export function getBaseInventoryStart() {
  return {
    type: types.GET_BASE_INVENTORY_START,
  };
}

export function getBaseInventorySuccess(baseInventory) {
  return {
    type: types.GET_BASE_INVENTORY_SUCCESS,
    baseInventory,
  };
}

export function getBaseInventoryFail() {
  return {
    type: types.GET_BASE_INVENTORY_FAIL,
  };
}

export function getBaseInventory() {
  return (dispatch, getState) => {
    dispatch(getBaseInventoryStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/dynamic-inventory/base-inventory/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        dispatch(getBaseInventorySuccess(resp.body.data));
      })
      .catch((ex) => {
        console.log('Failed to fetch base inventories', ex);
        dispatch(getBaseInventoryFail());
      });
  };
}

//Delete Base Inventory
export function deleteBaseInventoryStart() {
  return {
    type: types.DELETE_BASE_INVENTORY_START,
  };
}

export function deleteBaseInventorySuccess(baseInventoryId) {
  return {
    type: types.DELETE_BASE_INVENTORY_SUCCESS,
    baseInventoryId,
  };
}

export function deleteBaseInventoryFail() {
  return {
    type: types.DELETE_BASE_INVENTORY_FAIL,
  };
}

export function deleteBaseInventory({ baseInventoryId }, callback) {
  return (dispatch, getState) => {
    dispatch(deleteBaseInventoryStart());

    const { auth } = getState();

    request
      .delete(`${config.API_URL}/v0/ui/dynamic-inventory/base-inventory/${baseInventoryId}/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        dispatch(deleteBaseInventorySuccess(baseInventoryId));
        // callback();
      })
      .catch((ex) => {
        console.log('Failed to fetch base inventories', ex);
        dispatch(deleteBaseInventoryFail());
      });
  };
}

//Get Base Inventory By Id
export function getBaseInventoryByIdStart() {
  return {
    type: types.GET_BASE_INVENTORY_BY_ID_START,
  };
}

export function getBaseInventoryByIdSuccess(baseInventory) {
  return {
    type: types.GET_BASE_INVENTORY_BY_ID_SUCCESS,
    baseInventory,
  };
}

export function getBaseInventoryByIdFail() {
  return {
    type: types.GET_BASE_INVENTORY_BY_ID_FAIL,
  };
}

export function getBaseInventoryById({ baseInventoryId }) {
  return (dispatch, getState) => {
    dispatch(getBaseInventoryByIdStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/dynamic-inventory/base-inventory/${baseInventoryId}/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        dispatch(getBaseInventoryByIdSuccess(resp.body.data));
      })
      .catch((ex) => {
        console.log('Failed to fetch base inventories', ex);
        dispatch(getBaseInventoryByIdFail());
      });
  };
}

//Put Base Inventory
export function putBaseInventoryStart() {
  return {
    type: types.PUT_BASE_INVENTORY_START,
  };
}

export function putBaseInventorySuccess(inventory) {
  return {
    type: types.PUT_BASE_INVENTORY_SUCCESS,
    data: inventory,
  };
}

export function putBaseInventoryFail() {
  return {
    type: types.PUT_BASE_INVENTORY_FAIL,
  };
}

export function putBaseInventory({ data, baseInventoryId }, callback) {
  let req_data = {
    name: data.name,
    base_attributes: data.baseAttributes,
    inventory_type: 'space_based',
  };
  return (dispatch, getState) => {
    dispatch(putBaseInventoryStart());

    const { auth } = getState();

    request
      .put(`${config.API_URL}/v0/ui/dynamic-inventory/base-inventory/${baseInventoryId}/`)
      .set('Authorization', `JWT ${auth.token}`)
      .send(req_data)
      .then((resp) => {
        dispatch(putBaseInventorySuccess(resp.data));
        if (callback) {
          callback();
        }
      })
      .catch((ex) => {
        console.log('Failed to create base Inventory', ex);

        dispatch(putBaseInventoryFail());
      });
  };
}

// GET Inventory List
export function getInventoryListSuccess({ list }) {
  return {
    type: types.GET_INVENTORY_LIST_SUCCESS,
    list,
  };
}

export function getInventoryListFail() {
  return {
    type: types.GET_INVENTORY_LIST_FAIL,
  };
}

export function getInventoryList() {
  return (dispatch, getState) => {
    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/dynamic-inventory/inventory/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        dispatch(getInventoryListSuccess({ list: resp.body.data }));
      })
      .catch((ex) => {
        console.log('Failed to fetch inventory list', ex);

        dispatch(getInventoryListFail());
      });
  };
}

// POST Inventory
export function postInventoryStart() {
  return {
    type: types.POST_INVENTORY_START,
  };
}

export function postInventorySuccess() {
  return {
    type: types.POST_INVENTORY_SUCCESS,
  };
}

export function postInventoryFail() {
  return {
    type: types.POST_INVENTORY_FAIL,
  };
}

export function postInventory({ data }, callback) {
  return (dispatch, getState) => {
    dispatch(postInventoryStart());

    const { auth } = getState();

    request
      .post(`${config.API_URL}/v0/ui/dynamic-inventory/inventory/`)
      .set('Authorization', `JWT ${auth.token}`)
      .send(data)
      .then((resp) => {
        dispatch(postInventorySuccess());

        if (callback) {
          callback();
        }
      })
      .catch((ex) => {
        console.log('Failed to create inventory', ex);

        dispatch(postInventoryFail());
      });
  };
}

// PUT Inventory
export function putInventoryStart() {
  return {
    type: types.PUT_INVENTORY_START,
  };
}

export function putInventorySuccess() {
  return {
    type: types.PUT_INVENTORY_SUCCESS,
  };
}

export function putInventoryFail() {
  return {
    type: types.PUT_INVENTORY_FAIL,
  };
}

export function putInventory({ inventoryId, data }, callback) {
  return (dispatch, getState) => {
    dispatch(putInventoryStart());

    const { auth } = getState();

    request
      .put(`${config.API_URL}/v0/ui/dynamic-inventory/inventory/${inventoryId}/`)
      .set('Authorization', `JWT ${auth.token}`)
      .send(data)
      .then(() => {
        dispatch(putInventorySuccess());

        if (callback) {
          callback();
        }
      })
      .catch((ex) => {
        console.log('Failed to update inventory', ex);

        dispatch(putInventoryFail());
      });
  };
}

// DELETE Inventory
export function deleteInventorySuccess({ inventoryId }) {
  return {
    type: types.DELETE_INVENTORY_SUCCESS,
    inventoryId,
  };
}

export function deleteInventoryFail() {
  return {
    type: types.DELETE_INVENTORY_FAIL,
  };
}

export function deleteInventory(inventoryId, callback) {
  return (dispatch, getState) => {
    const { auth } = getState();

    request
      .delete(`${config.API_URL}/v0/ui/dynamic-inventory/inventory/${inventoryId}/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        dispatch(deleteInventorySuccess({ inventoryId }));

        if (callback) {
          callback();
        }
      })
      .catch((ex) => {
        console.log('Failed to create inventory', ex);

        dispatch(deleteInventoryFail());
      });
  };
}
