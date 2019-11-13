import createReducer from '../../lib/createReducer';
import * as types from '../../actions/types';

export const baseSupplierType = createReducer(
  {
    currentBaseSupplierType: undefined,
    baseSupplierTypeList: [],
  },

  {
    [types.POST_BASE_SUPPLIER_TYPE_START](state) {
      return Object.assign({}, state, {
        currentBaseSupplierType: undefined,
      });
    },
    [types.POST_BASE_SUPPLIER_TYPE_SUCCESS](state, action) {
      return Object.assign({}, state, {
        currentBaseSupplierType: action.data,
      });
    },
    [types.POST_BASE_SUPPLIER_TYPE_FAIL](state) {
      return Object.assign({}, state, {
        currentBaseSupplierType: undefined,
      });
    },
    [types.GET_CURRENT_BASE_SUPPLIER_TYPE_START](state) {
      return Object.assign({}, state, {
        currentBaseSupplierType: undefined,
      });
    },
    [types.GET_CURRENT_BASE_SUPPLIER_TYPE_SUCCESS](state, action) {
      return Object.assign({}, state, {
        currentBaseSupplierType: action.data,
      });
    },
    [types.GET_CURRENT_BASE_SUPPLIER_TYPE_FAIL](state) {
      return Object.assign({}, state, {
        currentBaseSupplierType: undefined,
      });
    },
    [types.GET_BASE_SUPPLIER_TYPE_LIST_START](state) {
      return Object.assign({}, state, {
        baseSupplierTypeList: [],
      });
    },
    [types.GET_BASE_SUPPLIER_TYPE_LIST_SUCCESS](state, action) {
      return Object.assign({}, state, {
        baseSupplierTypeList: action.data,
      });
    },
    [types.GET_BASE_SUPPLIER_TYPE_LIST_FAIL](state) {
      return Object.assign({}, state, {
        baseSupplierTypeList: [],
      });
    },
  }
);

export { baseSupplierType as default };
