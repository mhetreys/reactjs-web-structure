import createReducer from './../../lib/createReducer';
import * as types from './../../actions/types';

export const supplier = createReducer(
  {
    currentSupplier: undefined,
    supplierList: [],
  },

  {
    [types.POST_SUPPLIER_START](state) {
      return Object.assign({}, state, {
        currentSupplier: undefined,
      });
    },
    [types.POST_SUPPLIER_SUCCESS](state, action) {
      return Object.assign({}, state, {
        currentSupplier: action.data,
      });
    },
    [types.POST_SUPPLIER_FAIL](state) {
      return Object.assign({}, state, {
        currentSupplier: undefined,
      });
    },
    [types.GET_SUPPLIER_LIST_START](state) {
      return Object.assign({}, state, {
        supplierList: [],
        isFetchingSupplierList: true,
      });
    },
    [types.GET_SUPPLIER_LIST_SUCCESS](state, action) {
      return Object.assign({}, state, {
        supplierList: action.data,
        isFetchingSupplierList: false,
      });
    },
    [types.GET_SUPPLIER_LIST_FAIL](state) {
      return Object.assign({}, state, {
        supplierList: [],
        isFetchingSupplierList: false,
      });
    },
    [types.GET_CURRENT_SUPPLIER_START](state) {
      return Object.assign({}, state, {
        currentSupplier: undefined,
      });
    },
    [types.GET_CURRENT_SUPPLIER_SUCCESS](state, action) {
      return Object.assign({}, state, {
        currentSupplier: action.data,
      });
    },
    [types.GET_CURRENT_SUPPLIER_FAIL](state) {
      return Object.assign({}, state, {
        currentSupplier: undefined,
      });
    },
  }
);

export { supplier as default };
