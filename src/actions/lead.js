import request from 'superagent';

import * as types from './types';

import config from './../config';

//Get Permission List
export function getPermissionListStart() {
  return {
    type: types.GET_LEAD_PERMISSION_LIST_START,
  };
}

export function getPermissionListSuccess(permissionList) {
  return {
    type: types.GET_LEAD_PERMISSION_LIST_SUCCESS,
    data: permissionList,
  };
}

export function getPermissionListFail() {
  return {
    type: types.GET_LEAD_PERMISSION_LIST_FAIL,
  };
}

export function getLeadPermissionList() {
  return (dispatch, getState) => {
    dispatch(getPermissionListStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/leads/permissions/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        dispatch(getPermissionListSuccess(resp.body.data));
      })
      .catch((ex) => {
        console.log('Failed to fetch Lead', ex);

        dispatch(getPermissionListFail());
      });
  };
}

export function getLeadPermissionStart() {
  return {
    type: types.GET_LEAD_USER_PROFILE_PERMISSION_START,
  };
}

export function getLeadPermissionSuccess(leadProfilePermission, currentProfilePermissionId) {
  return {
    type: types.GET_LEAD_USER_PROFILE_PERMISSION_SUCCESS,
    leadProfilePermission: leadProfilePermission,
    currentProfilePermissionId: currentProfilePermissionId,
  };
}

export function getLeadPermissionFail() {
  return {
    type: types.GET_LEAD_USER_PROFILE_PERMISSION_FAIL,
  };
}

export function getLeadProfilePermission(profileId) {
  return (dispatch, getState) => {
    dispatch(getLeadPermissionStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/leads/list_all_leads_forms_by_campaign/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((leadsFormResponse) => {
        let leadsFormData = leadsFormResponse.body.data;
        request
          .get(`${config.API_URL}/v0/ui/leads/permissions/${profileId}/`)
          .set('Authorization', `JWT ${auth.token}`)
          .then((permissionResponse) => {
            let profilePermission = [];
            let profilePermissionData = permissionResponse.body.data;
            leadsFormData.forEach((campaignInfo) => {
              let campaignPermissionType = 'None';
              if (
                profilePermission !== 'no_permission_exists' &&
                profilePermissionData.leads_permissions.campaigns[campaignInfo.campaign_id]
              ) {
                if (
                  profilePermissionData.leads_permissions.campaigns[
                    campaignInfo.campaign_id
                  ].indexOf('EDIT') !== -1
                ) {
                  campaignPermissionType = 'Edit';
                } else if (
                  profilePermissionData.leads_permissions.campaigns[
                    campaignInfo.campaign_id
                  ].indexOf('FILL') !== -1
                ) {
                  campaignPermissionType = 'Fill';
                }
              }
              let permissionObject = {
                entityName: campaignInfo.campaign_name,
                entityId: campaignInfo.campaign_id,
                type: 'campaign',
                permission: campaignPermissionType,
                data: [],
              };
              if (campaignInfo.leads_forms.length) {
                campaignInfo.leads_forms.forEach((lead_form) => {
                  let leadFormPermissionType = 'None';
                  if (
                    profilePermission !== 'no_permission_exists' &&
                    profilePermissionData.leads_permissions.leads_forms[lead_form.lead_form_id]
                  ) {
                    if (
                      profilePermissionData.leads_permissions.leads_forms[
                        lead_form.lead_form_id
                      ].indexOf('EDIT') !== -1
                    ) {
                      leadFormPermissionType = 'Edit';
                    } else if (
                      profilePermissionData.leads_permissions.leads_forms[
                        lead_form.lead_form_id
                      ].indexOf('FILL') !== -1
                    ) {
                      leadFormPermissionType = 'Fill';
                    }
                  }
                  let permissionLeadFormObject = {
                    entityName: lead_form.lead_form_name,
                    entityId: lead_form.lead_form_id,
                    type: 'lead_form',
                    permission: leadFormPermissionType,
                  };
                  permissionObject.data.push(permissionLeadFormObject);
                });
              }
              profilePermission.push(permissionObject);
            });
            dispatch(getLeadPermissionSuccess(profilePermission, profilePermissionData.id));
          })
          .catch((ex) => {
            console.log('Failed to fetch Lead', ex);

            dispatch(getLeadPermissionFail());
          });
      })
      .catch((ex) => {
        console.log('Failed to fetch Lead', ex);

        dispatch(getLeadPermissionFail());
      });
  };
}

export function getAllLeadsFormData() {
  return (dispatch, getState) => {
    dispatch(getLeadPermissionStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/leads/list_all_leads_forms_by_campaign/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((leadFormsResponse) => {
        let leadFormData = leadFormsResponse.body.data;
        let profilePermission = [];
        leadFormData.forEach((campaignInfo) => {
          let campaignPermissionType = 'None';
          let permissionObject = {
            entityName: campaignInfo.campaign_name,
            entityId: campaignInfo.campaign_id,
            type: 'campaign',
            permission: campaignPermissionType,
            data: [],
          };
          if (campaignInfo.leads_forms.length) {
            campaignInfo.leads_forms.forEach((lead_form) => {
              let leadFormPermissionType = 'None';
              let permissionLeadFormObject = {
                entityName: lead_form.lead_form_name,
                entityId: lead_form.lead_form_id,
                type: 'lead_form',
                permission: leadFormPermissionType,
              };
              permissionObject.data.push(permissionLeadFormObject);
            });
          }
          profilePermission.push(permissionObject);
        });

        dispatch(getLeadPermissionSuccess(profilePermission, 0));
      })
      .catch((ex) => {
        console.log('Failed to fetch Lead', ex);

        dispatch(getLeadPermissionFail());
      });
  };
}

export function updateProfilePermission(data, callback) {
  return (dispatch, getState) => {
    dispatch(getLeadPermissionStart());

    const { auth } = getState();

    request
      .put(`${config.API_URL}/v0/ui/checklists/permissions/`)
      .set('Authorization', `JWT ${auth.token}`)
      .send(data)
      .then((resp) => {
        dispatch(getLeadPermissionList());
        if (callback) {
          callback();
        }
      })
      .catch((ex) => {
        console.log('Failed to create Lead template', ex);

        dispatch(getLeadPermissionFail());
      });
  };
}

export function updateLeadsProfilePermission(data, callback) {
  return (dispatch, getState) => {
    dispatch(getLeadPermissionStart());

    const { auth } = getState();

    request
      .put(`${config.API_URL}/v0/ui/leads/permissions/`)
      .set('Authorization', `JWT ${auth.token}`)
      .send(data)
      .then((resp) => {
        dispatch(getLeadPermissionList());
        if (callback) {
          callback();
        }
      })
      .catch((ex) => {
        console.log('Failed to create Lead template', ex);

        dispatch(getLeadPermissionFail());
      });
  };
}

export function createLeadsProfilePermission(data, callback) {
  return (dispatch, getState) => {
    dispatch(getLeadPermissionStart());

    const { auth } = getState();

    request
      .post(`${config.API_URL}/v0/ui/leads/permissions/`)
      .set('Authorization', `JWT ${auth.token}`)
      .send(data)
      .then((resp) => {
        dispatch(getLeadPermissionList());
        if (callback) {
          callback();
        }
      })
      .catch((ex) => {
        console.log('Failed to create Lead template', ex);

        dispatch(getLeadPermissionFail());
      });
  };
}

export function deleteLeadsProfilePermission(permissionId, callback) {
  return (dispatch, getState) => {
    dispatch(getLeadPermissionStart());

    const { auth } = getState();

    request
      .delete(`${config.API_URL}/v0/ui/leads/permissions/`)
      .set('Authorization', `JWT ${auth.token}`)
      .query({ permission_id: permissionId })
      .then((resp) => {
        dispatch(getLeadPermissionList());
        if (callback) {
          callback();
        }
      })
      .catch((ex) => {
        console.log('Failed to create Lead template', ex);

        dispatch(getLeadPermissionFail());
      });
  };
}

export function getCampaignsFormListStart() {
  return {
    type: types.GET_CAMPAIGNS_FORM_LIST_START,
  };
}

export function getCampaignsFormListSuccess(permissionList) {
  return {
    type: types.GET_CAMPAIGNS_FORM_LIST_SUCCESS,
    data: permissionList,
  };
}

export function getCampaignsFormListFail() {
  return {
    type: types.GET_CAMPAIGNS_FORM_LIST_FAIL,
  };
}

export function getCampaignsFormList({ campaignId }) {
  return (dispatch, getState) => {
    dispatch(getCampaignsFormListStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/leads/${campaignId}/form`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        console.log(resp.body.data);
        dispatch(getCampaignsFormListSuccess(resp.body.data));
      })
      .catch((ex) => {
        console.log('Failed to fetch Form', ex);

        dispatch(getCampaignsFormListFail());
      });
  };
}

export function postLeadFormStart() {
  return {
    type: types.POST_LEAD_FORM_START,
  };
}

export function postLeadFormSuccess(entity) {
  return {
    type: types.POST_LEAD_FORM_SUCCESS,
    data: entity,
  };
}

export function postLeadFormFail() {
  return {
    type: types.POST_LEAD_FORM_FAIL,
  };
}

export function postLeadForm({ data }, callback) {
  return (dispatch, getState) => {
    dispatch(postLeadFormStart());

    const { auth } = getState();

    request
      .post(`${config.API_URL}/v0/ui/leads/${data.campaignId}/create`)
      .set('Authorization', `JWT ${auth.token}`)
      .send(data)
      .then((resp) => {
        dispatch(postLeadFormSuccess(resp.data));
        if (callback) {
          callback();
        }
      })
      .catch((ex) => {
        console.log('Failed to create Form', ex);

        dispatch(postLeadFormFail());
      });
  };
}

//Get Lead Form Attributes
export function getLeadFormStart() {
  return {
    type: types.GET_LEAD_FORM_START,
  };
}

export function getLeadFormSuccess(entityType) {
  return {
    type: types.GET_LEAD_FORM_SUCCESS,
    data: entityType,
  };
}

export function getLeadFormFail() {
  return {
    type: types.GET_LEAD_FORM_FAIL,
  };
}

export function getLeadForm(leadFormId) {
  return (dispatch, getState) => {
    dispatch(getLeadFormStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/leads/${leadFormId}/form_by_id/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        console.log(resp.body);
        dispatch(getLeadFormSuccess(resp.body.data));
      })
      .catch((ex) => {
        console.log('Failed to fetch Form', ex);

        dispatch(getLeadFormFail());
      });
  };
}

export function updateLeadForm({ data, leadFormId }, callback) {
  return (dispatch, getState) => {
    dispatch(postLeadFormStart());

    const { auth } = getState();

    request
      .put(`${config.API_URL}/v0/ui/leads/${leadFormId}/edit_form`)
      .set('Authorization', `JWT ${auth.token}`)
      .send(data)
      .then((resp) => {
        dispatch(postLeadFormSuccess(resp.data));
        if (callback) {
          callback();
        }
      })
      .catch((ex) => {
        console.log('Failed to create Form', ex);

        dispatch(postLeadFormFail());
      });
  };
}
