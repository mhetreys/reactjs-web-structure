import React from 'react';
import Modal from 'react-modal';
import { DatetimePickerTrigger } from 'rc-datetime-picker';
import Select from 'react-select';
import moment from 'moment';
import { toastr } from 'react-redux-toastr';

import './index.css';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: '50%',
    transform: 'translate(-50%, -50%)',
  },
};

const getUserById = (users, userId) => {
  for (let i = 0, l = users.length; i < l; i += 1) {
    // eslint-disable-next-line
    if (users[i].id == userId) {
      // Use == match, since userId is sometimes numeric, sometimes string
      return users[i];
    }
  }

  return {};
};

export default class AssignModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditMode: false,
      release: {
        date: moment(),
        user: '',
      },
      closure: {
        date: moment(),
        user: '',
      },
      audit: {
        date: moment(),
        user: '',
      },
    };

    this.handleReleaseDateChange = this.handleReleaseDateChange.bind(this);
    this.handleReleaseUserChange = this.handleReleaseUserChange.bind(this);
    this.handleClosureDateChange = this.handleClosureDateChange.bind(this);
    this.handleClosureUserChange = this.handleClosureUserChange.bind(this);
    this.handleAuditDateChange = this.handleAuditDateChange.bind(this);
    this.handleAuditUserChange = this.handleAuditUserChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { getAssignmentList, campaign } = this.props;

    // Fetch assignments
    getAssignmentList(campaign);
  }

  componentDidUpdate(prevProps) {
    const { booking: prevBooking } = prevProps;
    const { booking: newBooking, inventory, onClose, user } = this.props;

    if (
      prevBooking.isCreatingAssignment &&
      !newBooking.isCreatingAssignment &&
      newBooking.postAssignmentSuccess
    ) {
      toastr.success('', 'Assignment created successfully');
      onClose();
    } else if (
      prevBooking.isCreatingAssignment &&
      !newBooking.isCreatingAssignment &&
      newBooking.putAssignmentError
    ) {
      toastr.error('', 'Failed to create assignment. Please try again later.');
    } else if (
      prevBooking.isUpdatingAssignment &&
      !newBooking.isUpdatingAssignment &&
      newBooking.putAssignmentSuccess
    ) {
      toastr.success('', 'Assignemnt updated successfully');
      onClose();
    } else if (
      prevBooking.isUpdatingAssignment &&
      !newBooking.isUpdatingAssignment &&
      newBooking.putAssignmentError
    ) {
      toastr.error('', 'Failed to update Assignment. Please try again later.');
    }

    if (prevBooking.isFetchingAssignment && !newBooking.isFetchingAssignment) {
      const key = `${inventory.supplier_id}-${inventory.inventory_name}`;
      const assignments = newBooking.assignmentList[key];

      if (assignments && Object.keys(assignments).length) {
        let release = {
          date: moment(),
          user: '',
        };
        let closure = {
          date: moment(),
          user: '',
        };
        let audit = {
          date: moment(),
          user: '',
        };
        if (assignments.RELEASE.length) {
          release = {
            date: moment(assignments.RELEASE[0].activity_date),
            user: getUserById(user.userList, assignments.RELEASE[0].assigned_to_id),
          };
        }
        if (assignments.CLOSURE.length) {
          closure = {
            date: moment(assignments.CLOSURE[0].activity_date),
            user: getUserById(user.userList, assignments.CLOSURE[0].assigned_to_id),
          };
        }
        if (assignments.AUDIT.length) {
          audit = {
            date: moment(assignments.AUDIT[0].activity_date),
            user: getUserById(user.userList, assignments.AUDIT[0].assigned_to_id),
          };
        }
        this.setState({
          isEditMode: true,
          release: release,
          closure: closure,
          audit: audit,
        });
      }
    }
  }

  handleReleaseDateChange(date) {
    const { release } = this.state;

    this.setState({
      release: { ...release, date },
    });
  }

  handleReleaseUserChange(user) {
    const { release } = this.state;

    this.setState({
      release: { ...release, user },
    });
  }

  handleClosureDateChange(date) {
    const { closure } = this.state;

    this.setState({
      closure: { ...closure, date },
    });
  }

  handleClosureUserChange(user) {
    const { closure } = this.state;

    this.setState({
      closure: { ...closure, user },
    });
  }

  handleAuditDateChange(date) {
    const { audit } = this.state;

    this.setState({
      audit: { ...audit, date },
    });
  }

  handleAuditUserChange(user) {
    const { audit } = this.state;

    this.setState({
      audit: { ...audit, user },
    });
  }

  onSubmit() {
    const { campaign, inventory, postAssignment, putAssignment } = this.props;
    const { release, closure, audit, isEditMode } = this.state;

    const data = {
      campaign_id: campaign.campaignId,
      inventory_name: inventory.inventory_name,
      supplier_id: inventory.supplier_id,
      activity_list: [
        {
          assigned_to_id: release.user.id,
          activity_type: 'RELEASE',
          activity_date: moment(release.date).format('YYYY-MM-DD'),
        },
        {
          assigned_to_id: closure.user.id,
          activity_type: 'CLOSURE',
          activity_date: moment(closure.date).format('YYYY-MM-DD'),
        },
        {
          assigned_to_id: audit.user.id,
          activity_type: 'AUDIT',
          activity_date: moment(audit.date).format('YYYY-MM-DD'),
        },
      ],
    };

    if (isEditMode) {
      putAssignment({
        ...campaign,
        data,
      });
    } else {
      postAssignment({ data });
    }
  }

  render() {
    const { user, isVisible, onClose } = this.props;
    const { userList } = user;
    const { release, closure, audit } = this.state;

    return (
      <Modal isOpen={isVisible} style={customStyles} ariaHideApp={false}>
        <div className="modal modal-assign">
          <div className="modal__header">
            <h3>Manage Activity Dates</h3>
          </div>
          <div className="modal__body">
            <form>
              <h5>Release</h5>
              <div className="modal-assign__group">
                <div className="form-control">
                  <DatetimePickerTrigger
                    moment={release.date}
                    onChange={this.handleReleaseDateChange}
                  >
                    <input type="text" value={release.date.format('YYYY-MM-DD')} readOnly />
                  </DatetimePickerTrigger>
                </div>
                <div className="form-control">
                  <Select
                    className="select"
                    options={userList}
                    getOptionValue={(option) => option.id}
                    getOptionLabel={(option) => option.username}
                    onChange={this.handleReleaseUserChange}
                    value={release.user}
                  />
                </div>
              </div>

              <h5>Closure</h5>
              <div className="modal-assign__group">
                <div className="form-control">
                  <DatetimePickerTrigger
                    moment={closure.date}
                    onChange={this.handleClosureDateChange}
                  >
                    <input type="text" value={closure.date.format('YYYY-MM-DD')} readOnly />
                  </DatetimePickerTrigger>
                </div>
                <div className="form-control">
                  <Select
                    className="select"
                    options={userList}
                    getOptionValue={(option) => option.id}
                    getOptionLabel={(option) => option.username}
                    onChange={this.handleClosureUserChange}
                    value={closure.user}
                  />
                </div>
              </div>

              <h5>Audit</h5>
              <div className="modal-assign__group">
                <div className="form-control">
                  <DatetimePickerTrigger moment={audit.date} onChange={this.handleAuditDateChange}>
                    <input type="text" value={audit.date.format('YYYY-MM-DD')} readOnly />
                  </DatetimePickerTrigger>
                </div>
                <div className="form-control">
                  <Select
                    className="select"
                    options={userList}
                    getOptionValue={(option) => option.id}
                    getOptionLabel={(option) => option.username}
                    onChange={this.handleAuditUserChange}
                    value={audit.user}
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="modal__footer">
            <button type="button" className="btn btn--danger" onClick={this.onSubmit}>
              Save
            </button>
            <button type="button" className="btn btn--danger" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}
