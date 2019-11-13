import React from 'react';
import Select from 'react-select';
import Modal from 'react-modal';

import './index.css';

import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import TextFieldIcon from '@material-ui/icons/TextFields';
import Tree, { getTreeLeafDataByIndexArray } from 'material-ui-tree';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    maxHeight: '550px',
    minWidth: '100px',
    width: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '15px 10px 10px',
  },
};

const classes = {
  container: 'tree-modal',
  icon: 'tree-icon',
  leaf: 'TreeDemo-leaf-179',
};

export default class PermissionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        supplierName: 'All Campaign',
        type: 'campaign',
        entityId: 'all',
        data: [],
      },
      userProfileOptions: [],
      selectedProfile: {
        label: undefined,
        value: undefined,
      },
    };
    this.onSelectProfile = this.onSelectProfile.bind(this);
  }

  componentWillMount() {
    if (this.props.createPermission) {
      this.props.getUserProfileList();
    }
  }

  componentDidUpdate() {
    if (
      (!this.state.data.data.length && this.props.dataInfo.length) ||
      (this.state.data.data.length &&
        this.props.dataInfo.length &&
        this.state.data.data[0].entityId !== this.props.dataInfo[0].entityId)
    ) {
      let dataInfo = this.state.data;
      dataInfo.data = this.props.dataInfo;
      this.setState({
        data: dataInfo,
      });
    }
    if (
      (!this.state.userProfileOptions.length && this.props.userProfile.userProfileList.length) ||
      0
      // (this.state.userProfileOptions.length &&
      //   this.props.userProfile.userProfileList.length &&
      //   this.state.userProfileOptions[0].value !==
      //     this.props.userProfile.userProfileList[0].id)
    ) {
      let userProfileOptions = [];
      this.props.userProfile.userProfileList.forEach((userProfileData) => {
        if (this.props.existingProfileIds.indexOf(userProfileData.id) === -1) {
          userProfileOptions.push({
            label: userProfileData.name,
            value: userProfileData.id,
          });
        }
      });
      if (userProfileOptions.length === 0) {
        userProfileOptions.push({
          label: 'No more profiles',
          value: undefined,
        });
      }
      this.setState({
        userProfileOptions,
      });
    }
  }

  onSelectProfile(value) {
    if (value.value) {
      this.setState({
        selectedProfile: value,
      });
    }
  }

  requestTreeLeafChildrenData = (leafData, chdIndex, doExpand) => {
    doExpand();
  };

  renderTreeLeafLabel = (leafData, expand) => {
    const { supplierName, type } = leafData;
    if (type === 'campaign') {
      if (!expand) {
        return (
          <Typography viriant="body1" className={classes.leaf}>
            <FolderIcon className={classes.icon} />
            {supplierName}
          </Typography>
        );
      }
    }
    return (
      <Typography viriant="body1" className={classes.leaf}>
        <FolderOpenIcon className={classes.icon} />
        {supplierName}
      </Typography>
    );
  };

  getTreeLeafActionsData = (leafData, chdIndex, expand) => {
    return [
      {
        icon: <ClearIcon className="tree-action" />,
        hint: 'None',
        className:
          'permission-icon' + (leafData.permission === 'None' ? ' permission-selected' : ''),
        onClick: () => {
          const data = { ...this.state.data };
          const leaf = getTreeLeafDataByIndexArray(data, chdIndex, 'data');
          leaf.permission = 'None';
          if (leaf.data && leaf.data.length) {
            leaf.data.forEach((leafData) => {
              leafData.permission = 'None';
              if (leafData.data && leafData.data.length) {
                leafData.data.forEach((childData) => {
                  childData.permission = 'None';
                });
              }
            });
          }
          this.setState({ data });
        },
      },
      {
        icon: <EditIcon className="tree-action" />,
        hint: 'Edit',
        className:
          'permission-icon' + (leafData.permission === 'Edit' ? ' permission-selected' : ''),
        onClick: () => {
          const data = { ...this.state.data };
          const leaf = getTreeLeafDataByIndexArray(data, chdIndex, 'data');
          leaf.permission = 'Edit';
          if (leaf.data && leaf.data.length) {
            leaf.data.forEach((leafData) => {
              leafData.permission = 'Edit';
              if (leafData.data && leafData.data.length) {
                leafData.data.forEach((childData) => {
                  childData.permission = 'Edit';
                });
              }
            });
          }
          this.setState({ data });
        },
      },
      {
        icon: <TextFieldIcon className="tree-action" />,
        hint: 'Fill',
        className:
          'permission-icon' + (leafData.permission === 'Fill' ? ' permission-selected' : ''),
        onClick: () => {
          const data = { ...this.state.data };
          const leaf = getTreeLeafDataByIndexArray(data, chdIndex, 'data');
          leaf.permission = 'Fill';
          if (leaf.data && leaf.data.length) {
            leaf.data.forEach((leafData) => {
              leafData.permission = 'Fill';
              if (leafData.data && leafData.data.length) {
                leafData.data.forEach((childData) => {
                  childData.permission = 'Fill';
                });
              }
            });
          }
          this.setState({ data });
        },
      },
    ];
  };

  render() {
    return (
      <Modal isOpen={this.props.showPermissionModal} style={customStyles} ariaHideApp={false}>
        <div className="modal-title">
          <h3>Profile Permission</h3>
        </div>
        {this.props.createPermission ? (
          <div className="createform__form__inline">
            <div className="form-control">
              <label>*Select Profile</label>
              <br />
              <Select
                className="modal-select"
                options={this.state.userProfileOptions}
                value={this.state.selectedProfile}
                onChange={this.onSelectProfile}
              />
            </div>
          </div>
        ) : (
          ''
        )}
        <Tree
          className={classes.container}
          data={this.state.data}
          labelName="supplierName"
          valueName="entityId"
          childrenName="data"
          renderLabel={this.renderTreeLeafLabel}
          getActionsData={this.getTreeLeafActionsData}
          childrenCountPerPage={100}
        />
        <div className="modal-footer">
          <button type="button" className="btn btn--danger" onClick={this.props.onClose}>
            Close
          </button>{' '}
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => this.props.onSubmit(this.state)}
          >
            Submit
          </button>
        </div>
      </Modal>
    );
  }
}
