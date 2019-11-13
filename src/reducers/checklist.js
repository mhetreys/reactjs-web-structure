import createReducer from './../lib/createReducer';
import * as types from './../actions/types';

export const checklist = createReducer(
  {
    list: [],
    templateList: [],
    details: {} // Checklist data by checklist id
  },

  {
    [types.GET_CHECKLISTS_START](state) {
      return Object.assign({}, state, {
        list: []
      });
    },
    [types.GET_CHECKLISTS_SUCCESS](state, action) {
      return Object.assign({}, state, {
        list: action.checklists
      });
    },
    [types.GET_CHECKLISTS_FAIL](state) {
      return Object.assign({}, state, {
        list: []
      });
    },
    [types.DELETE_CHECKLIST_SUCCESS](state, action) {
      const newList = state.list.slice();

      for (let i = 0, l = newList.length; i < l; i += 1) {
        if (newList[i].checklist_id === action.checklistId) {
          newList.splice(i, 1);
          break;
        }
      }

      return Object.assign({}, state, {
        list: newList
      });
    },
    [types.POST_CHECKLIST_TEMPLATE_START](state) {
      const newState = Object.assign({}, state);

      if (newState.templateCreateStatus) {
        delete newState.templateCreateStatus;
      }

      return newState;
    },
    [types.POST_CHECKLIST_TEMPLATE_SUCCESS](state) {
      return Object.assign({}, state, {
        templateCreateStatus: 'success'
      });
    },
    [types.POST_CHECKLIST_TEMPLATE_FAIL](state) {
      return Object.assign({}, state, {
        templateCreateStatus: 'error'
      });
    },
    [types.UPDATE_CHECKLIST_TEMPLATE_START](state) {
      const newState = Object.assign({}, state);

      if (newState.templateUpdateStatus) {
        delete newState.templateUpdateStatus;
      }

      return newState;
    },
    [types.UPDATE_CHECKLIST_TEMPLATE_SUCCESS](state) {
      return Object.assign({}, state, {
        templateUpdateStatus: 'success'
      });
    },
    [types.UPDATE_CHECKLIST_TEMPLATE_FAIL](state) {
      return Object.assign({}, state, {
        templateUpdateStatus: 'error'
      });
    },
    [types.GET_SINGLE_CHECKLIST_START](state) {
      return Object.assign({}, state, {
        details: {}
      });
    },
    [types.GET_SINGLE_CHECKLIST_SUCCESS](state, action) {
      return Object.assign({}, state, {
        details: Object.assign({}, state.details, {
          [action.checklistId]: action.checklist
        })
      });
    },
    [types.POST_CHECKLIST_ENTRIES_START](state) {
      const newState = Object.assign({}, state);

      if (newState.entryStatus) {
        delete newState.entryStatus;
      }

      return newState;
    },
    [types.POST_CHECKLIST_ENTRIES_SUCCESS](state) {
      return Object.assign({}, state, {
        entryStatus: 'success'
      });
    },
    [types.POST_CHECKLIST_ENTRIES_FAIL](state) {
      return Object.assign({}, state, {
        entryStatus: 'error'
      });
    },
    [types.GET_CHECKLIST_TEMPLATE_LIST_START](state) {
      return Object.assign({}, state, {
        templateList: []
      });
    },
    [types.GET_CHECKLIST_TEMPLATE_LIST_SUCCESS](state, action) {
      return Object.assign({}, state, {
        templateList: action.data
      });
    },
    [types.GET_CHECKLIST_TEMPLATE_LIST_FAIL](state) {
      return Object.assign({}, state, {
        templateList: []
      });
    }
  }
);

export { checklist as default };
