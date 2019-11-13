import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

export const supplierStatic = createReducer(
  {
    list: [],
    currentSupplier: undefined,
  },

  {
    [types.GET_SUPPLIERS_STATIC_LIST_START](state) {
      return Object.assign({}, state, {
        list: [],
      });
    },
    [types.GET_SUPPLIERS_STATIC_LIST_SUCCESS](state, action) {
      return Object.assign({}, state, {
        list: action.suppliers,
      });
    },
    [types.GET_SUPPLIERS_STATIC_LIST_FAIL](state) {
      return Object.assign({}, state, {
        list: [],
      });
    },
    [types.GET_CURRENT_SUPPLIER_START](state) {
      return Object.assign({}, state, {
        currentSupplier: undefined,
      });
    },
    [types.GET_CURRENT_SUPPLIER_SUCCESS](state, action) {
      return Object.assign({}, state, {
        currentSupplier: action.currentSupplier,
      });
    },
    [types.GET_CURRENT_SUPPLIER_FAIL](state) {
      return Object.assign({}, state, {
        currentSupplier: undefined,
      });
    },
  }
);

export { supplierStatic as default };
