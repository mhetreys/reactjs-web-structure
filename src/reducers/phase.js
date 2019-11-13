import createReducer from './../lib/createReducer';
import * as types from './../actions/types';

export const phase = createReducer(
  {
    phaseList: [],
  },
  {
    [types.POST_PHASE_START](state) {
      return {
        ...state,
        isCreatingPhase: true,
        postPhaseSuccess: false,
        postPhaseError: false,
      };
    },
    [types.POST_PHASE_SUCCESS](state, action) {
      return {
        ...state,
        phaseList: action.phases,
        isCreatingPhase: false,
        postPhaseSuccess: true,
      };
    },
    [types.POST_PHASE_FAIL](state) {
      return {
        ...state,
        isCreatingPhase: false,
        postPhaseError: true,
      };
    },
    [types.GET_PHASE_LIST_START](state) {
      return {
        ...state,
        isFetchingPhase: true,
      };
    },
    [types.GET_PHASE_LIST_SUCCESS](state, action) {
      return {
        ...state,
        isFetchingPhase: false,
        phaseList: action.list,
      };
    },
    [types.GET_PHASE_LIST_FAIL](state) {
      return {
        ...state,
        isFetchingPhase: false,
        phaseList: [],
      };
    },
    [types.DELETE_PHASE_START](state) {
      return {
        ...state,
        isDeletingPhase: true,
      };
    },
    [types.DELETE_PHASE_SUCCESS](state, action) {
      const { phaseList } = state;
      return {
        ...state,
        isDeletingPhase: false,
        phaseList: phaseList.filter((item) => item.id !== action.id),
      };
    },
    [types.DELETE_PHASE_FAIL](state) {
      return {
        ...state,
        isDeletingPhase: false,
      };
    },
  }
);

export { phase as default };
