import React from 'react';
import { Link } from 'react-router-dom';

import AssignModal from './../Modals/AssignModal';

const getConsolidatedList = (list) => {
  const listMap = {};
  let key = '';

  for (let i = 0, l = list.length; i < l; i += 1) {
    key = `${list[i].supplier_id}-${list[i].inventory_name}`;

    if (!listMap[key]) {
      listMap[key] = { ...list[i], count: 1 };
    } else {
      listMap[key].count += 1;
    }
  }

  return Object.values(listMap);
};

export default class AuditPlan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      supplierById: {},
      searchFilter: '',
      isAssignModalVisible: false,
    };

    this.getCampaignId = this.getCampaignId.bind(this);
    this.renderAuditPlanRow = this.renderAuditPlanRow.bind(this);
    this.onSearchFilterChange = this.onSearchFilterChange.bind(this);
    this.onManageActivity = this.onManageActivity.bind(this);
    this.onAssignModalClose = this.onAssignModalClose.bind(this);
    this.onBack = this.onBack.bind(this);
  }

  componentDidMount() {
    const {
      getCampaignInventoryList,
      getSupplierList,
      getUsersList,
      getCampaignsList,
    } = this.props;
    getSupplierList();
    getCampaignInventoryList({ campaignId: this.getCampaignId() });
    getCampaignsList();

    // Fetch users list for AssignModal
    getUsersList();
  }

  componentDidUpdate(prevProps) {
    const { supplier: prevSupplier } = prevProps;
    const { supplier: newSupplier } = this.props;

    if (prevSupplier.isFetchingSupplierList && !newSupplier.isFetchingSupplierList) {
      const { supplierList } = newSupplier;
      const supplierById = {};

      for (let i = 0, l = supplierList.length; i < l; i += 1) {
        supplierById[supplierList[i].id] = supplierList[i];
      }

      this.setState({
        supplierById,
      });
    }
  }

  onSearchFilterChange(event) {
    this.setState({
      searchFilter: event.target.value,
    });
  }

  onManageActivity(activity) {
    this.setState({
      selectedInventory: activity,
      isAssignModalVisible: true,
    });
  }

  onAssignModalClose() {
    this.setState({
      isAssignModalVisible: false,
    });
  }

  getCampaignId() {
    const { match } = this.props;
    return match.params.campaignId;
  }

  onBack() {
    const { match } = this.props;
    this.props.history.push(`/r/booking/list/${this.getCampaignId()}`);
  }

  renderAuditPlanRow(inventory) {
    let supplierName = '';
    if (this.state.supplierById[inventory.supplier_id]) {
      supplierName = this.state.supplierById[inventory.supplier_id].name;
    }

    const onManageDateClick = () => {
      this.onManageActivity(inventory);
    };

    return (
      <tr key={inventory.id}>
        <td>1</td>
        <td>
          {inventory.inventory_name} ({inventory.count})
        </td>
        <td>{supplierName}</td>
        <td>-</td>
        <td>
          <button type="button" className="btn btn--danger" onClick={onManageDateClick}>
            Manage Date
          </button>
        </td>
        <td>
          <Link
            to={`/r/booking/plan/${this.getCampaignId()}/image/supplier/${inventory.supplier_id}`}
            className="btn btn--danger"
          >
            Manage Image
          </Link>
        </td>
      </tr>
    );
  }

  render() {
    const { booking } = this.props;
    const { campaignInventoryList } = booking;
    const { searchFilter, selectedInventory, isAssignModalVisible } = this.state;

    let campaignName = '';
    const { campaign } = this.props;
    let campaignId = this.getCampaignId();
    if (campaign && campaign.objectById && campaign.objectById[campaignId]) {
      campaignName = campaign.objectById[campaignId].name;
    }

    const list = getConsolidatedList(campaignInventoryList);

    return (
      <div className="booking-base__create audit-plan">
        <div className="audit-plan__title">
          <h3>Campaign Release and Audit Plan ({campaignName})</h3>
        </div>

        <button type="button" className="btn btn--danger" onClick={this.onBack}>
          <i className="fa fa-arrow-left" aria-hidden="true" />
          &nbsp; Back
        </button>
        <br />
        <br />

        <div className="audit-plan__filter">
          <input
            type="text"
            placeholder="Search..."
            value={searchFilter}
            onChange={this.onSearchFilterChange}
          />
        </div>

        <div className="audit-plan__table">
          <table cellPadding="0" cellSpacing="0">
            <thead>
              <tr>
                <th>Phase</th>
                <th>Inventory</th>
                <th>Supplier Name</th>
                <th>Assigned Date</th>
                <th>Action</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list && list.length ? (
                list.map(this.renderAuditPlanRow)
              ) : (
                <tr>
                  <td colSpan="5">No releases available!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {isAssignModalVisible ? (
          <AssignModal
            {...this.props}
            inventory={selectedInventory}
            onClose={this.onAssignModalClose}
            isVisible={isAssignModalVisible}
            campaign={{ campaignId: this.getCampaignId() }}
          />
        ) : null}
      </div>
    );
  }
}
