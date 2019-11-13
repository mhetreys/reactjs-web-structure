import request from 'superagent';

import * as types from './types';

import config from './../config';

//get states list

export function getStatesStart() {
  return {
    type: types.GET_STATES_START,
  };
}

export function getStatesSuccess({ states }) {
  return {
    type: types.GET_STATES_SUCCESS,
    states,
  };
}

export function getStatesFail() {
  return {
    type: types.GET_STATES_FAIL,
  };
}

export function getStates() {
  return (dispatch, getState) => {
    dispatch(getStatesStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/dynamic-location/state/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        dispatch(getStatesSuccess({ states: resp.body.data }));
      })
      .catch((ex) => {
        console.log('Failed to fetch list of campaigns', ex);

        dispatch(getStatesFail());
      });
  };
}

// get cities

export function getCitiesStart() {
  return {
    type: types.GET_CITIES_START,
  };
}

export function getCitiesSuccess({ cities }) {
  return {
    type: types.GET_CITIES_SUCCESS,
    cities,
  };
}

export function getCitiesFail() {
  return {
    type: types.GET_CITIES_FAIL,
  };
}

export function getCities({ id }) {
  return (dispatch, getState) => {
    dispatch(getCitiesStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/dynamic-location/city-by-state/${id}/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        dispatch(getCitiesSuccess({ cities: resp.body.data }));
      })
      .catch((ex) => {
        console.log('Failed to fetch list of cities', ex);

        dispatch(getCitiesFail());
      });
  };
}

//get Areas

export function getAreasStart() {
  return {
    type: types.GET_AREAS_START,
  };
}

export function getAreasSuccess({ areas }) {
  return {
    type: types.GET_AREAS_SUCCESS,
    areas,
  };
}

export function getAreasFail() {
  return {
    type: types.GET_AREAS_FAIL,
  };
}

export function getAreas({ id }) {
  return (dispatch, getState) => {
    dispatch(getAreasStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/dynamic-location/area-by-city/${id}/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        dispatch(getAreasSuccess({ areas: resp.body.data }));
      })
      .catch((ex) => {
        console.log('Failed to fetch list of areas', ex);

        dispatch(getAreasFail());
      });
  };
}

//get SubAreas

export function getSubAreasStart() {
  return {
    type: types.GET_SUBAREAS_START,
  };
}

export function getSubAreasSuccess({ subareas }) {
  return {
    type: types.GET_SUBAREAS_SUCCESS,
    subareas,
  };
}

export function getSubAreasFail() {
  return {
    type: types.GET_SUBAREAS_FAIL,
  };
}

export function getSubAreas({ id }) {
  return (dispatch, getState) => {
    dispatch(getSubAreasStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/dynamic-location/sub-area-by-area/${id}/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        dispatch(getSubAreasSuccess({ subareas: resp.body.data }));
      })
      .catch((ex) => {
        console.log('Failed to fetch list of subareas', ex);

        dispatch(getSubAreasFail());
      });
  };
}
