// List of checklists
import React from 'react';
import { Link } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';

export default class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchFilter: '',
    };

    this.renderChecklistRow = this.renderChecklistRow.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onSearchFilterChange = this.onSearchFilterChange.bind(this);
    this.getFilteredList = this.getFilteredList.bind(this);
  }

  componentDidMount() {
    let campaignProposalId = this.props.match.params.campaignId;
    let supplierId = this.props.match.params.supplierId;
    this.props.getCurrentCampaign(campaignProposalId);
    if (supplierId) {
      this.props.getCurrentSupplier(supplierId);
      this.props.getSupplierChecklists({
        campaignId: campaignProposalId,
        supplierId: supplierId,
      });
    } else {
      this.props.getCampaignChecklists({
        campaignId: campaignProposalId,
      });
    }
  }

  onBack() {
    this.props.history.goBack();
  }

  onEdit(checklistId) {
    this.props.history.push(`/r/checklist/edit/${checklistId}`);
  }

  onSearchFilterChange(event) {
    this.setState({
      searchFilter: event.target.value,
    });
  }

  getFilteredList(list) {
    return list.filter(
      (item) =>
        item.checklist_info.checklist_name
          .toLowerCase()
          .replace(/[^0-9a-z]/gi, '')
          .indexOf(this.state.searchFilter.toLowerCase().replace(/[^0-9a-z]/gi, '')) !== -1
    );
  }

  renderChecklistRow(checklist, index) {
    let { settings } = this.props;
    let editPermission = true;

    // if (settings.loggedInChecklistPermission.checklists[checklist.checklist_info.checklist_id]) {
    //   if (
    //     settings.loggedInChecklistPermission.checklists[
    //       checklist.checklist_info.checklist_id
    //     ].indexOf('EDIT') !== -1
    //   ) {
    //     editPermission = true;
    //   }
    // } else {
    //   return;
    // }

    // Remove checklist
    const onRemove = () => {
      let campaignId = this.props.match.params.campaignId;
      let supplierId = this.props.match.params.supplierId;

      this.props.deleteChecklist(
        {
          checklistId: checklist.checklist_info.checklist_id,
        },
        () => {
          toastr.success('', 'Checklist deleted successfully');
          if (supplierId) {
            this.props.getSupplierChecklists({ campaignId, supplierId });
          } else {
            this.props.getCampaignChecklists({ campaignId });
          }
        }
      );
    };

    let disableEditButton = false;
    if (checklist.checklist_info.status === 'frozen') {
      disableEditButton = true;
    }

    return (
      <tr key={checklist.checklist_info.checklist_id}>
        <td className="hidden-xs">{index + 1}</td>
        <td className="checklist-name">{checklist.checklist_info.checklist_name}</td>
        <td>
          <Link
            to={`/r/checklist/fill/${checklist.checklist_info.checklist_id}`}
            className="btn btn--danger"
          >
            Fill Checklist
          </Link>
        </td>
        <td>
          <button
            type="button"
            className="btn btn--danger"
            onClick={onRemove}
            disabled={!editPermission}
          >
            Remove
          </button>
        </td>
        <td>
          {disableEditButton ? (
            <button type="button" className="btn btn--danger" disabled>
              Edit Checklist
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => this.onEdit(checklist.checklist_info.checklist_id)}
              disabled={!editPermission}
            >
              Edit Checklist
            </button>
          )}
        </td>
      </tr>
    );
  }

  render() {
    const { supplier, campaign, checklist, settings } = this.props;

    let campaignId = this.props.match.params.campaignId;
    let campaignPermission = true;
    let emptyChecklistText = 'No checklists available. Create your first one now!';
    // if (
    //   settings.loggedInChecklistPermission.campaigns &&
    //   settings.loggedInChecklistPermission.campaigns[campaignId]
    // ) {
    //   campaignPermission = true;
    //   emptyChecklistText = 'No checklists available. Create your first one now!';
    // }

    let supplierChecklistFlag = true;
    let headingText = 'Checklists for ',
      checklistCreateUrl,
      showCreateButton = false;

    if (!this.props.match.params.supplierId) {
      supplierChecklistFlag = false;
    }

    if (supplierChecklistFlag) {
      headingText += 'Supplier ' + (supplier.currentSupplier ? supplier.currentSupplier.name : '');

      checklistCreateUrl = `/r/checklist/create/${this.props.match.params.campaignId}/${
        this.props.match.params.supplierId
      }`;
      if (campaign.currentCampaign && supplier.currentSupplier) {
        showCreateButton = true;
      }
    } else {
      headingText +=
        'Campaign ' + (campaign.currentCampaign ? campaign.currentCampaign.campaign.name : '');

      checklistCreateUrl = `/r/checklist/create/${this.props.match.params.campaignId}`;
      if (campaign.currentCampaign) {
        showCreateButton = true;
      }
    }

    const filteredList = this.getFilteredList(checklist.list);

    return (
      <div className="list">
        <div className="list__title">
          <h3>{headingText}</h3>
        </div>
        <div className="list__filter">
          <input
            type="text"
            placeholder="Search..."
            onChange={this.onSearchFilterChange}
            value={this.state.searchFilter}
          />
        </div>
        <div className="list__table">
          <table cellPadding="0" cellSpacing="0">
            <thead>
              <tr>
                <th className="hidden-xs">Index</th>
                <th className="checklist-name">Name</th>
                <th>Action</th>
                <th>Action</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length && campaignPermission ? (
                filteredList.map(this.renderChecklistRow)
              ) : (
                <tr>
                  <td colSpan="5">{emptyChecklistText}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="list__actions">
          <button type="button" className="btn btn--danger" onClick={this.onBack}>
            <i className="fa fa-arrow-left" aria-hidden="true" />
            &nbsp; Back
          </button>{' '}
          {showCreateButton && campaignPermission ? (
            <Link to={checklistCreateUrl} className="btn btn--danger">
              Create
            </Link>
          ) : (
            undefined
          )}
        </div>
      </div>
    );
  }
}
