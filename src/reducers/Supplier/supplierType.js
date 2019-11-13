import createReducer from '../../lib/createReducer';
import * as types from '../../actions/types';

export const supplierType = createReducer(
  {
    currentSupplierType: undefined,
    supplierTypeList: [],
  },

  {
    [types.POST_SUPPLIER_TYPE_START](state) {
      return Object.assign({}, state, {
        currentSupplierType: undefined,
      });
    },
    [types.POST_SUPPLIER_TYPE_SUCCESS](state, action) {
      return Object.assign({}, state, {
        currentSupplierType: action.data,
      });
    },
    [types.POST_SUPPLIER_TYPE_FAIL](state) {
      return Object.assign({}, state, {
        currentSupplierType: undefined,
      });
    },
    [types.GET_CURRENT_SUPPLIER_TYPE_START](state) {
      return Object.assign({}, state, {
        currentSupplierType: undefined,
      });
    },
    [types.GET_CURRENT_SUPPLIER_TYPE_SUCCESS](state, action) {
      return Object.assign({}, state, {
        currentSupplierType: action.data,
      });
    },
    [types.GET_CURRENT_SUPPLIER_TYPE_FAIL](state) {
      return Object.assign({}, state, {
        currentSupplierType: undefined,
      });
    },
    [types.GET_SUPPLIER_TYPE_LIST_START](state) {
      return Object.assign({}, state, {
        supplierTypeList: [],
      });
    },
    [types.GET_SUPPLIER_TYPE_LIST_SUCCESS](state, action) {
      return Object.assign({}, state, {
        supplierTypeList: action.data,
      });
    },
    [types.GET_SUPPLIER_TYPE_LIST_FAIL](state) {
      return Object.assign({}, state, {
        supplierTypeList: [],
      });
    },
  }
);

export { supplierType as default };
