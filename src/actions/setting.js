import request from 'superagent';

import * as types from './types';

import config from './../config';

//Get Permission List
export function getPermissionListStart() {
  return {
    type: types.GET_PERMISSION_LIST_START,
  };
}

export function getPermissionListSuccess(permissionList) {
  return {
    type: types.GET_PERMISSION_LIST_SUCCESS,
    data: permissionList,
  };
}

export function getPermissionListFail() {
  return {
    type: types.GET_PERMISSION_LIST_FAIL,
  };
}

export function getPermissionList() {
  return (dispatch, getState) => {
    dispatch(getPermissionListStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/checklists/permissions/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        dispatch(getPermissionListSuccess(resp.body.data));
      })
      .catch((ex) => {
        console.log('Failed to fetch supplier', ex);

        dispatch(getPermissionListFail());
      });
  };
}

export function getPermissionStart() {
  return {
    type: types.GET_USER_PERMISSION_START,
  };
}

export function getPermissionSuccess(profilePermission, currentProfilePermissionId) {
  return {
    type: types.GET_USER_PERMISSION_SUCCESS,
    profilePermission: profilePermission,
    currentProfilePermissionId: currentProfilePermissionId,
  };
}

export function getPermissionFail() {
  return {
    type: types.GET_USER_PERMISSION_FAIL,
  };
}

export function getProfilePermission(userProfileId) {
  return (dispatch, getState) => {
    dispatch(getPermissionStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/checklists/list_all_checklists/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((checklistResponse) => {
        let checklistData = checklistResponse.body.data;
        request
          .get(`${config.API_URL}/v0/ui/checklists/permissions/${userProfileId}/`)
          .set('Authorization', `JWT ${auth.token}`)
          .then((permissionResponse) => {
            let profilePermission = [];
            let profilePermissionData = permissionResponse.body.data;
            checklistData.forEach((campaignInfo) => {
              let campaignPermissionType = 'None';
              if (
                profilePermission !== 'no_permission_exists' &&
                profilePermissionData.checklist_permissions.campaigns[campaignInfo.campaign_id]
              ) {
                if (
                  profilePermissionData.checklist_permissions.campaigns[
                    campaignInfo.campaign_id
                  ].indexOf('EDIT') !== -1
                ) {
                  campaignPermissionType = 'Edit';
                } else if (
                  profilePermissionData.checklist_permissions.campaigns[
                    campaignInfo.campaign_id
                  ].indexOf('FILL') !== -1
                ) {
                  campaignPermissionType = 'Fill';
                }
              }
              let permissionObject = {
                supplierName: campaignInfo.campaign_name,
                supplierId: campaignInfo.campaign_id,
                type: 'campaign',
                permission: campaignPermissionType,
                data: [],
              };
              if (campaignInfo.checklists.length) {
                campaignInfo.checklists.forEach((checklist) => {
                  let checklistPermissionType = 'None';
                  if (
                    profilePermission !== 'no_permission_exists' &&
                    profilePermissionData.checklist_permissions.checklists[checklist.checklist_id]
                  ) {
                    if (
                      profilePermissionData.checklist_permissions.checklists[
                        checklist.checklist_id
                      ].indexOf('EDIT') !== -1
                    ) {
                      checklistPermissionType = 'Edit';
                    } else if (
                      profilePermissionData.checklist_permissions.checklists[
                        checklist.checklist_id
                      ].indexOf('FILL') !== -1
                    ) {
                      checklistPermissionType = 'Fill';
                    }
                  }
                  let permissionChecklistObject = {
                    supplierName: checklist.checklist_name,
                    supplierId: checklist.checklist_id,
                    type: 'checklist',
                    permission: checklistPermissionType,
                  };
                  permissionObject.data.push(permissionChecklistObject);
                });
              }
              profilePermission.push(permissionObject);
            });
            dispatch(getPermissionSuccess(profilePermission, profilePermissionData.id));
          })
          .catch((ex) => {
            console.log('Failed to fetch supplier', ex);

            dispatch(getPermissionFail());
          });
      })
      .catch((ex) => {
        console.log('Failed to fetch supplier', ex);

        dispatch(getPermissionFail());
      });
  };
}

export function getAllChecklistData() {
  return (dispatch, getState) => {
    dispatch(getPermissionStart());

    const { auth } = getState();

    request
      .get(`${config.API_URL}/v0/ui/checklists/list_all_checklists/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((checklistResponse) => {
        let checklistData = checklistResponse.body.data;
        let profilePermission = [];
        checklistData.forEach((campaignInfo) => {
          let campaignPermissionType = 'None';
          let permissionObject = {
            supplierName: campaignInfo.campaign_name,
            supplierId: campaignInfo.campaign_id,
            type: 'campaign',
            permission: campaignPermissionType,
            data: [],
          };
          if (campaignInfo.checklists.length) {
            campaignInfo.checklists.forEach((checklist) => {
              let checklistPermissionType = 'None';
              let permissionChecklistObject = {
                supplierName: checklist.checklist_name,
                supplierId: checklist.checklist_id,
                type: 'checklist',
                permission: checklistPermissionType,
              };
              permissionObject.data.push(permissionChecklistObject);
            });
          }
          profilePermission.push(permissionObject);
        });
        dispatch(getPermissionSuccess(profilePermission, 0));
      })
      .catch((ex) => {
        console.log('Failed to fetch supplier', ex);

        dispatch(getPermissionFail());
      });
  };
}

export function updateProfilePermission(data, callback) {
  return (dispatch, getState) => {
    dispatch(getPermissionStart());

    const { auth } = getState();

    request
      .put(`${config.API_URL}/v0/ui/checklists/permissions/`)
      .set('Authorization', `JWT ${auth.token}`)
      .send(data)
      .then((resp) => {
        dispatch(getPermissionList());
        if (callback) {
          callback();
        }
      })
      .catch((ex) => {
        console.log('Failed to create checklist template', ex);

        dispatch(getPermissionFail());
      });
  };
}

export function createProfilePermission(data, callback) {
  return (dispatch, getState) => {
    dispatch(getPermissionStart());

    const { auth } = getState();

    request
      .post(`${config.API_URL}/v0/ui/checklists/permissions/`)
      .set('Authorization', `JWT ${auth.token}`)
      .send(data)
      .then((resp) => {
        dispatch(getPermissionList());
        if (callback) {
          callback();
        }
      })
      .catch((ex) => {
        console.log('Failed to create checklist template', ex);

        dispatch(getPermissionFail());
      });
  };
}

export function deleteProfilePermission(permissionId, callback) {
  return (dispatch, getState) => {
    dispatch(getPermissionStart());

    const { auth } = getState();

    request
      .delete(`${config.API_URL}/v0/ui/checklists/permissions/`)
      .set('Authorization', `JWT ${auth.token}`)
      .query({ permission_id: permissionId })
      .then((resp) => {
        dispatch(getPermissionList());
        if (callback) {
          callback();
        }
      })
      .catch((ex) => {
        console.log('Failed to create checklist template', ex);

        dispatch(getPermissionFail());
      });
  };
}

export function getloggedInProfilePermissionStart() {
  return {
    type: types.GET_LOGGED_IN_USER_PERMISSION_START,
  };
}

export function getloggedInProfilePermissionSuccess(loggedInChecklistPermission) {
  return {
    type: types.GET_LOGGED_IN_USER_PERMISSION_SUCCESS,
    loggedInChecklistPermission: loggedInChecklistPermission,
  };
}

export function getloggedInProfilePermissionFail() {
  return {
    type: types.GET_LOGGED_IN_USER_PERMISSION_FAIL,
  };
}

export function getloggedInProfilePermission() {
  return (dispatch, getState) => {
    dispatch(getloggedInProfilePermissionStart());

    const { auth } = getState();
    request
      .get(`${config.API_URL}/v0/ui/checklists/permissions/self/`)
      .set('Authorization', `JWT ${auth.token}`)
      .then((resp) => {
        let loggedInProfilePermission = resp.body.data;
        if (loggedInProfilePermission === 'no_permission_exists') {
          loggedInProfilePermission = [];
        } else {
          loggedInProfilePermission = loggedInProfilePermission.checklist_permissions;
        }
        dispatch(getloggedInProfilePermissionSuccess(loggedInProfilePermission));
      })
      .catch((ex) => {
        console.log('Failed to fetch supplier', ex);

        dispatch(getloggedInProfilePermissionFail());
      });
  };
}
