import React from 'react';
import PermissionModal from '../Modals/PermissionModal';
import { toastr } from 'react-redux-toastr';

import '../Checklist/index.css';

export default class LeadSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPermissionModal: false,
      modalProfileId: undefined,
      createPermission: false,
      existingProfileIds: [],
      dataInfo: [],
      profilePermissionId: undefined
    };
    this.renderPermissionRow = this.renderPermissionRow.bind(this);
    this.openCreatePermissionModal = this.openCreatePermissionModal.bind(this);
    this.closePermissionModal = this.closePermissionModal.bind(this);
    this.handleEditProfile = this.handleEditProfile.bind(this);
    this.handleDeleteProfile = this.handleDeleteProfile.bind(this);
    this.onModalSubmit = this.onModalSubmit.bind(this);
  }
  componentWillMount() {
    this.props.getLeadPermissionList();
  }
  componentDidUpdate(prevProps) {
    if (
      (!prevProps.leads.leadProfilePermission.length &&
        this.props.leads.leadProfilePermission.length) ||
      prevProps.leads.currentProfilePermissionId !==
        this.props.leads.currentProfilePermissionId
    ) {
      let dataInfo = this.props.leads.leadProfilePermission;
      this.setState({
        dataInfo,
        profilePermissionId: this.props.leads.currentProfilePermissionId
      });
    }
  }
  handleEditProfile(profileId) {
    this.props.getLeadProfilePermission(profileId);
    this.setState({
      showPermissionModal: true,
      modalProfileId: profileId,
      createPermission: false
    });
  }
  handleDeleteProfile(permissionId) {
    this.props.deleteLeadsProfilePermission(permissionId, () => {
      toastr.success('', 'Profile Lead Permission deleted successfully');
    });
  }
  openCreatePermissionModal() {
    this.props.getAllLeadsFormData();
    let { leadPermissionList } = this.props.leads;
    let existingProfileIds = [];
    if (leadPermissionList.length) {
      leadPermissionList.forEach(permission => {
        existingProfileIds.push(permission.profile_id.id);
      });
    }
    this.setState({
      existingProfileIds,
      showPermissionModal: true,
      createPermission: true
    });
  }
  onModalSubmit(state) {
    let requestData = {
      id: undefined,
      leads_permissions: {
        campaigns: {},
        leads_forms: {}
      },
      profile_id: undefined
    };
    if (!this.state.createPermission) {
      requestData.id = this.state.profilePermissionId;
      requestData.profile_id = this.state.modalProfileId;
    } else {
      requestData.profile_id = state.selectedProfile.value;
    }
    state.data.data.forEach(campaignData => {
      if (
        campaignData.type === 'campaign' &&
        campaignData.permission !== 'None'
      ) {
        if (campaignData.permission === 'Edit') {
          requestData.leads_permissions.campaigns[campaignData.entityId] = [
            'EDIT',
            'VIEW',
            'DELETE',
            'FILL',
            'FREEZE',
            'UNFREEZE'
          ];
        } else {
          requestData.leads_permissions.campaigns[campaignData.entityId] = [
            'VIEW',
            'FILL',
            'FREEZE'
          ];
        }
      }
      if (campaignData.data.length) {
        campaignData.data.forEach(leadFormData => {
          if (
            leadFormData.type === 'lead_form' &&
            leadFormData.permission !== 'None'
          ) {
            if (leadFormData.permission === 'Edit') {
              requestData.leads_permissions.leads_forms[
                leadFormData.entityId
              ] = ['EDIT', 'VIEW', 'DELETE', 'FILL'];
            } else {
              requestData.leads_permissions.leads_forms[
                leadFormData.entityId
              ] = ['VIEW', 'FILL'];
            }
          }
        });
      }
    });

    this.setState({
      showPermissionModal: false,
      modalProfileId: undefined,
      createPermission: false
    });
    if (this.state.createPermission) {
      this.props.createLeadsProfilePermission([requestData], () => {
        toastr.success('', 'Profile Lead Permission created successfully');
      });
    } else {
      this.props.updateLeadsProfilePermission([requestData], () => {
        toastr.success('', 'Profile Lead Permission updated successfully');
      });
    }
  }

  closePermissionModal() {
    this.setState({
      showPermissionModal: false,
      createPermission: false
    });
  }
  renderPermissionRow(permission, index) {
    return (
      <tr key={permission.id}>
        <td>{index + 1}</td>
        <td>{permission.profile_id.name}</td>
        <td>Custom</td>
        <td>{permission.name}</td>
        <td>
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => this.handleEditProfile(permission.profile_id.id)}
          >
            Edit
          </button>{' '}
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => this.handleDeleteProfile(permission.id)}
          >
            Remove
          </button>
        </td>
      </tr>
    );
  }
  render() {
    let { leads } = this.props;
    return (
      <div className="list">
        <div className="list__title">
          <h3>Lead Permission List</h3>
        </div>
        <div className="list__table">
          <table cellPadding="0" cellSpacing="0">
            <thead>
              <tr>
                <th>Index</th>
                <th>Name</th>
                <th>Permission</th>
                <th>Created by</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.leadPermissionList.length ? (
                leads.leadPermissionList.map(this.renderPermissionRow)
              ) : (
                <tr>
                  <td colSpan="5">No leads permissions available!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="list__actions">
          <button
            type="button"
            className="btn btn--danger"
            onClick={this.openCreatePermissionModal}
          >
            Create
          </button>
        </div>
        {this.state.showPermissionModal ? (
          <PermissionModal
            {...this.props}
            {...this.state}
            onClose={this.closePermissionModal}
            onSubmit={this.onModalSubmit}
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}
