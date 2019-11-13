import createReducer from './../lib/createReducer';
import * as types from './../actions/types';

export const baseInventory = createReducer(
  {
    baseInventoryList: [],
    baseAttributes: [],
    baseInventory: undefined,
    selectedBaseInventoryName: undefined,
    selectedBaseInventoryId: undefined,

    inventoryList: [],
  },
  {
    [types.GET_BASE_INVENTORY_START](state) {
      return Object.assign({}, state, {
        baseInventoryList: [],
      });
    },
    [types.GET_BASE_INVENTORY_SUCCESS](state, action) {
      return Object.assign({}, state, {
        baseInventoryList: action.baseInventory,
      });
    },
    [types.GET_BASE_INVENTORY_FAIL](state) {
      return Object.assign({}, state, {
        baseInventoryList: [],
      });
    },
    [types.POST_BASE_INVENTORY_START](state) {
      return Object.assign({}, state, {
        baseInventory: undefined,
      });
    },
    [types.POST_BASE_INVENTORY_SUCCESS](state, action) {
      return Object.assign({}, state, {
        baseInventory: action.data,
      });
    },
    [types.POST_BASE_INVENTORY_FAIL](state) {
      return Object.assign({}, state, {
        baseInventory: undefined,
      });
    },
    [types.DELETE_BASE_INVENTORY_START](state) {
      return Object.assign({}, state, {
        baseInventory: undefined,
      });
    },
    [types.DELETE_BASE_INVENTORY_SUCCESS](state, action) {
      // const newList = state.list.slice();
      const newList = [];

      for (let i = 0, l = newList.length; i < l; i += 1) {
        if (newList[i]._id === action.baseInventoryId) {
          newList.splice(i, 1);
          break;
        }
      }

      return Object.assign({}, state, {
        list: newList,
      });
    },
    [types.GET_BASE_INVENTORY_BY_ID_START](state) {
      return Object.assign({}, state, {
        baseAttributes: [],
      });
    },
    [types.GET_BASE_INVENTORY_BY_ID_SUCCESS](state, action) {
      return Object.assign({}, state, {
        selectedBaseInventoryName: action.baseInventory.name,
        selectedBaseInventoryId: action.baseInventory._id,
        baseAttributes: action.baseInventory.base_attributes,
      });
    },
    [types.GET_BASE_INVENTORY_BY_ID_FAIL](state) {
      return Object.assign({}, state, {
        baseAttributes: [],
      });
    },
    [types.GET_INVENTORY_LIST_SUCCESS](state, action) {
      return Object.assign({}, state, {
        inventoryList: Object.keys(action.list).map((key) => action.list[key]),
      });
    },
    [types.GET_INVENTORY_LIST_FAIL](state) {
      return Object.assign({}, state, {
        inventoryList: [],
      });
    },
    [types.DELETE_INVENTORY_SUCCESS](state, action) {
      return Object.assign({}, state, {
        inventoryList: state.inventoryList.filter((item) => item._id !== action.inventoryId),
      });
    },
  }
);

export { baseInventory as default };
