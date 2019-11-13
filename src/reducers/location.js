import createReducer from './../lib/createReducer';
import * as types from './../actions/types';

export const locationData = createReducer(
  {
    states: [],
    cities: [],
    areas: [],
    subareas: [],
  },
  {
    [types.GET_STATES_SUCCESS](state, action) {
      return Object.assign({}, state, {
        states: action.states,
      });
    },
    [types.GET_STATES_FAIL](state) {
      return Object.assign({}, state, {
        states: [],
      });
    },
    [types.GET_CITIES_SUCCESS](state, action) {
      return Object.assign({}, state, {
        cities: action.cities,
      });
    },
    [types.GET_CITIES_FAIL](state) {
      return Object.assign({}, state, {
        cities: [],
      });
    },
    [types.GET_AREAS_SUCCESS](state, action) {
      return Object.assign({}, state, {
        areas: action.areas,
      });
    },
    [types.GET_AREAS_FAIL](state) {
      return Object.assign({}, state, {
        areas: [],
      });
    },
    [types.GET_SUBAREAS_SUCCESS](state, action) {
      return Object.assign({}, state, {
        subareas: action.subareas,
      });
    },
    [types.GET_SUBAREAS_FAIL](state) {
      return Object.assign({}, state, {
        subareas: [],
      });
    },
  }
);

export { locationData as default };
