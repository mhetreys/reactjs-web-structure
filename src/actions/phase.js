import request from 'superagent';

import * as types from './types';

import config from './../config';

/* Phase: Start */
export function postPhaseStart() {
  return {
    type: types.POST_PHASE_START,
  };
}

export function postPhaseSuccess({ phases }) {
  return {
    type: types.POST_PHASE_SUCCESS,
    phases,
  };
}

export function postPhaseFail() {
  return {
    type: types.POST_PHASE_FAIL,
  };
}

export function postPhase({ data, campaignId }) {
  return (dispatch, getState) => {
    dispatch(postPhaseStart());

    const { auth } = getState();

    request
      .post(`${config.API_URL}/v0/ui/website/supplier-phase/?campaign_id=${campaignId}`)
      .set('Authorization', `JWT ${auth.token}`)
      .send(data)
      .then((resp) => {
        dispatch(postPhaseSuccess({ phases: resp.body.data }));
      })
      .catch((ex) => {
        console.log('Failed to create phase', ex);

        dispatch(postPhaseFail());
      });
  };
}

const getPhaseListStart = () => {
  return {
    type: types.GET_PHASE_LIST_START,
  };
};

const getPhaseListSuccess = ({ list }) => {
  return {
    type: types.GET_PHASE_LIST_SUCCESS,
    list,
  };
};

const getPhaseListFail = () => {
  return {
    type: types.GET_PHASE_LIST_FAIL,
  };
};

export function getPhaseList({ campaignId }) {
  return (dispatch, getState) => {
    dispatch(getPhaseListStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/website/supplier-phase/?campaign_id=${campaignId}`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        dispatch(getPhaseListSuccess({ list: resp.body.data }));
      })
      .catch((ex) => {
        console.log('Failed to fetch list of phases', ex);

        dispatch(getPhaseListFail());
      });
  };
}

const deletePhaseStart = () => {
  return {
    type: types.DELETE_PHASE_START,
  };
};

const deletePhaseSuccess = ({ id }) => {
  return {
    type: types.DELETE_PHASE_SUCCESS,
    id,
  };
};

const deletePhaseEnd = () => {
  return {
    type: types.DELETE_PHASE_FAIL,
  };
};

export function deletePhase({ id }) {
  return (dispatch, getState) => {
    dispatch(deletePhaseStart());

    const { auth } = getState();

    request
      .delete(`${config.API_URL}/v0/ui/website/supplier-phase/${id}/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then(() => {
        dispatch(deletePhaseSuccess({ id }));
      })
      .catch((ex) => {
        console.log('Failed to delete booking template', ex);

        dispatch(deletePhaseEnd());
      });
  };
}
/* Phase: End */
