import React from 'react';
import PermissionModal from '../Modals/PermissionModal';
import { toastr } from 'react-redux-toastr';

export default class PermissionList extends React.Component {
  constructor(props) {
    super();
    this.state = {
      showPermissionModal: false,
      modalProfileId: undefined,
      createPermission: false,
      dataInfo: [],
      profilePermissionId: undefined,
      existingProfileIds: [],
    };
    this.renderPermissionRow = this.renderPermissionRow.bind(this);
    this.handleEditProfile = this.handleEditProfile.bind(this);
    this.closePermissionModal = this.closePermissionModal.bind(this);
    this.openCreatePermissionModal = this.openCreatePermissionModal.bind(this);
    this.onModalSubmit = this.onModalSubmit.bind(this);
    this.handleDeleteProfile = this.handleDeleteProfile.bind(this);
  }

  componentWillMount() {
    this.props.getPermissionList();
  }

  componentDidUpdate(prevProps) {
    if (
      (!prevProps.settings.profilePermission.length &&
        this.props.settings.profilePermission.length) ||
      prevProps.settings.currentProfilePermissionId !==
        this.props.settings.currentProfilePermissionId
    ) {
      let dataInfo = this.props.settings.profilePermission;
      this.setState({
        dataInfo,
        profilePermissionId: this.props.settings.currentProfilePermissionId,
      });
    }
  }

  handleEditProfile(profileId) {
    this.props.getProfilePermission(profileId);
    this.setState({
      showPermissionModal: true,
      modalProfileId: profileId,
      createPermission: false,
    });
  }

  handleDeleteProfile(permissionId) {
    this.props.deleteProfilePermission(permissionId, () => {
      toastr.success('', 'Profile Checklist Permission deleted successfully');
    });
  }

  closePermissionModal() {
    this.setState({
      showPermissionModal: false,
      modalProfileId: undefined,
      createPermission: false,
    });
  }

  openCreatePermissionModal() {
    this.props.getAllChecklistData();

    let { permissionList } = this.props.settings;
    let existingProfileIds = [];
    if (permissionList.length) {
      permissionList.forEach((permission) => {
        existingProfileIds.push(permission.profile_id.id);
      });
    }

    this.setState({
      showPermissionModal: true,
      existingProfileIds,
      createPermission: true,
      modalProfileId: undefined,
    });
  }

  onModalSubmit(state) {
    let requestData = {
      id: undefined,
      checklist_permissions: {
        campaigns: {},
        checklists: {},
      },
      profile_id: undefined,
    };
    if (!this.state.createPermission) {
      requestData.id = this.state.profilePermissionId;
      requestData.profile_id = this.state.modalProfileId;
    } else {
      requestData.profile_id = state.selectedProfile.value;
    }
    console.log(state);

    state.data.data.forEach((campaignData) => {
      if (campaignData.type === 'campaign' && campaignData.permission !== 'None') {
        if (campaignData.permission === 'Edit') {
          requestData.checklist_permissions.campaigns[campaignData.supplierId] = [
            'EDIT',
            'VIEW',
            'DELETE',
            'FILL',
            'FREEZE',
            'UNFREEZE',
          ];
        } else {
          requestData.checklist_permissions.campaigns[campaignData.supplierId] = [
            'VIEW',
            'FILL',
            'FREEZE',
          ];
        }
      }
      if (campaignData.data.length) {
        campaignData.data.forEach((checklistData) => {
          if (checklistData.type === 'checklist' && checklistData.permission !== 'None') {
            if (checklistData.permission === 'Edit') {
              requestData.checklist_permissions.checklists[checklistData.supplierId] = [
                'EDIT',
                'VIEW',
                'DELETE',
                'FILL',
                'FREEZE',
                'UNFREEZE',
              ];
            } else {
              requestData.checklist_permissions.checklists[checklistData.supplierId] = [
                'VIEW',
                'FILL',
                'FREEZE',
              ];
            }
          }
        });
      }
    });

    this.setState({
      showPermissionModal: false,
      modalProfileId: undefined,
      createPermission: false,
    });

    if (this.state.createPermission) {
      this.props.createProfilePermission([requestData], () => {
        toastr.success('', 'Profile Permission created successfully');
      });
    } else {
      this.props.updateProfilePermission([requestData], () => {
        toastr.success('', 'Profile Permission updated successfully');
      });
    }
  }

  renderPermissionRow(permission, index) {
    return (
      <tr key={permission.id}>
        <td>{index + 1}</td>
        <td>{permission.profile_id.name}</td>
        <td>Custom</td>
        <td>{permission.created_by.first_name + ' ' + permission.created_by.last_name}</td>
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
    let { settings } = this.props;

    return (
      <div className="list">
        <div className="list__title">
          <h3>Permission List</h3>
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
              {settings.permissionList.length ? (
                settings.permissionList.map(this.renderPermissionRow)
              ) : (
                <tr>
                  <td colSpan="5">No permissions available!</td>
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
