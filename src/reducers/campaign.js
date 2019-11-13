import createReducer from './../lib/createReducer';
import * as types from './../actions/types';

export const campaign = createReducer(
  {
    list: [],
    currentCampaign: undefined,
    objectById: {},
  },

  {
    [types.GET_CAMPAIGNS_LIST_SUCCESS](state, action) {
      return Object.assign({}, state, {
        list: action.campaigns,
        objectById: Object.assign({}, ...action.campaigns.map((c) => ({ [c.proposal_id]: c }))),
      });
    },
    [types.GET_CAMPAIGNS_LIST_FAIL](state) {
      return Object.assign({}, state, {
        list: [],
      });
    },
    [types.GET_CURRENT_CAMPAIGN_START](state) {
      return Object.assign({}, state, {
        currentCampaign: undefined,
      });
    },
    [types.GET_CURRENT_CAMPAIGN_SUCCESS](state, action) {
      return Object.assign({}, state, {
        currentCampaign: action.currentCampaign,
      });
    },
    [types.GET_CURRENT_CAMPAIGN_FAIL](state) {
      return Object.assign({}, state, {
        currentCampaign: undefined,
      });
    },
  }
);

export { campaign as default };
