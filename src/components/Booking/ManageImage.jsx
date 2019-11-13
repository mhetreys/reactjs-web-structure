import React from 'react';
import Select from 'react-select';
import ViewImageModal from '../Modals/ViewImagesModal';
import UploadImageModal from '../Modals/UploadImageModal';

const getFilteredList = (list, assignmentList, filters = {}) => {
  const filteredList = list
    .map((item) => [
      ...assignmentList[item].RELEASE,
      ...assignmentList[item].AUDIT,
      ...assignmentList[item].CLOSURE,
    ])
    .reduce((acc, item) => acc.concat(item), [])
    .filter((item) => {
      // If supplier match fails
      if (filters.supplierId && filters.supplierId !== item.supplier_id) {
        return false;
      }

      // If activity type match fails
      if (filters.activityType && filters.activityType !== item.activity_type) {
        return false;
      }

      return true;
    });

  return filteredList;
};

const ActivityTypes = [
  { value: 'ALL', label: 'All' },
  { value: 'RELEASE', label: 'Release' },
  { value: 'AUDIT', label: 'Audit' },
  { value: 'CLOSURE', label: 'Closure' },
];

export default class ManageImage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      supplierById: {},
      searchFilter: '',
      userById: '',
      isViewImageModalVisible: false,
      isUploadImageModalVisible: false,
      selectedRow: {},
      filterActivityType: ActivityTypes[0],
      filterSupplier: {},
    };

    this.getCampaignId = this.getCampaignId.bind(this);
    this.onSearchFilterChange = this.onSearchFilterChange.bind(this);
    this.renderListRow = this.renderListRow.bind(this);
    this.onViewImageClick = this.onViewImageClick.bind(this);
    this.onUploadImageClick = this.onUploadImageClick.bind(this);
    this.onViewImageModalClose = this.onViewImageModalClose.bind(this);
    this.onUploadImageModalClose = this.onUploadImageModalClose.bind(this);
    this.onSupplierFilterChange = this.onSupplierFilterChange.bind(this);
    this.onActivityTypeChange = this.onActivityTypeChange.bind(this);
    this.onBack = this.onBack.bind(this);
  }

  componentDidMount() {
    const {
      getSupplierList,
      getAssignmentList,
      getCampaignInventoryList,
      getUsersList,
      getCampaignsList,
    } = this.props;
    getSupplierList();
    getCampaignInventoryList({ campaignId: this.getCampaignId() });
    getAssignmentList({ campaignId: this.getCampaignId() });
    getCampaignsList();

    getUsersList();
  }

  componentDidUpdate(prevProps) {
    const { supplier: prevSupplier, user: prevUser } = prevProps;
    const { supplier: newSupplier, user: newUser } = this.props;

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

    if (prevUser.isFetchingUserList && !newUser.isFetchingUserList) {
      const { userList } = newUser;
      const userById = {};

      for (let i = 0, l = userList.length; i < l; i += 1) {
        userById[userList[i].id] = userList[i];
      }

      this.setState({
        userById,
      });
    }
  }

  onSearchFilterChange(event) {
    this.setState({
      searchFilter: event.target.value,
    });
  }

  onSupplierFilterChange(option) {
    this.setState({
      filterSupplier: option,
    });
  }

  onActivityTypeChange(option) {
    this.setState({
      filterActivityType: option,
    });
  }

  getCampaignId() {
    const { match } = this.props;
    return match.params.campaignId;
  }

  onViewImageClick(item) {
    this.setState({
      isViewImageModalVisible: true,
      selectedRow: item,
    });
  }

  onUploadImageClick(item) {
    this.setState({
      isUploadImageModalVisible: true,
      selectedRow: item,
    });
  }

  onViewImageModalClose() {
    this.setState({
      isViewImageModalVisible: false,
    });
  }

  onUploadImageModalClose() {
    this.setState({
      isUploadImageModalVisible: false,
    });
  }

  onBack() {
    const { match } = this.props;
    this.props.history.push(`/r/booking/plan/${this.getCampaignId()}`);
  }

  renderListRow(item) {
    const { supplierById, userById } = this.state;
    let supplierName = '';
    let userName = '';
    const viewImageClick = () => {
      this.onViewImageClick(item);
    };

    const uploadImageClick = () => {
      this.onUploadImageClick(item);
    };

    if (supplierById[item.supplier_id]) {
      supplierName = supplierById[item.supplier_id].name;
    }

    if (userById[item.assigned_to_id]) {
      userName = userById[item.assigned_to_id].username;
    }

    return (
      <tr key={item.id}>
        <td>{supplierName}</td>
        <td>{item.inventory_name}</td>
        <td>{item.activity_type}</td>
        <td>{item.activity_date}</td>
        <td>{userName}</td>
        <td>{item.inventory_images ? item.inventory_images.length : '0'}</td>
        <td>
          <button type="button" className="btn btn--danger" onClick={viewImageClick}>
            View Images
          </button>
        </td>
        <td>
          <button type="button" className="btn btn--danger" onClick={uploadImageClick}>
            Upload Image
          </button>
        </td>
      </tr>
    );
  }

  render() {
    const { booking, supplier, match } = this.props;
    const supplierId = match.params.supplierId;
    const { assignmentList } = booking;
    const {
      supplierById,
      isViewImageModalVisible,
      isUploadImageModalVisible,
      selectedRow,
      filterSupplier,
      filterActivityType,
    } = this.state;

    const assignmentListKeys = Object.keys(assignmentList);
    const selectedSupplierId = filterSupplier.id || supplierId;
    const list = getFilteredList(assignmentListKeys, assignmentList, {
      activityType: filterActivityType.value !== 'ALL' ? filterActivityType.value : '',
      supplierId: selectedSupplierId,
    });

    let campaignName = '';
    const { campaign } = this.props;
    let campaignId = this.getCampaignId();
    if (campaign && campaign.objectById && campaign.objectById[campaignId]) {
      campaignName = campaign.objectById[campaignId].name;
    }

    return (
      <div className="booking-base__create manage-image">
        <div className="manage-image__title">
          <h3>Manage Image ({campaignName})</h3>
        </div>

        <button type="button" className="btn btn--danger" onClick={this.onBack}>
          <i className="fa fa-arrow-left" aria-hidden="true" />
          &nbsp; Back
        </button>
        <br />
        <br />

        <div className="manage-image__filters">
          <div className="form-control">
            <Select
              className="select"
              options={supplier.supplierList}
              getOptionValue={(option) => option.id}
              getOptionLabel={(option) => option.name}
              value={supplierById[selectedSupplierId]}
              onChange={this.onSupplierFilterChange}
              placeholder="Select Supplier"
            />
          </div>
          <div className="form-control">
            <Select
              className="select"
              options={ActivityTypes}
              onChange={this.onActivityTypeChange}
              value={filterActivityType}
              placeholder="Select Activity Type"
            />
          </div>
        </div>

        <div className="manage-image__table">
          <table cellPadding="0" cellSpacing="0">
            <thead>
              <tr>
                <th>Supplier Name</th>
                <th>Inventory Type</th>
                <th>Activity Type</th>
                <th>Activity date</th>
                <th>Assigned User</th>
                <th>Images</th>
                <th>Action</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list && list.length ? (
                list.map(this.renderListRow)
              ) : (
                <tr>
                  <td colSpan="7">No releases available!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {isViewImageModalVisible ? (
          <ViewImageModal
            onClose={this.onViewImageModalClose}
            isVisible={isViewImageModalVisible}
            item={selectedRow}
          />
        ) : null}
        {isUploadImageModalVisible ? (
          <UploadImageModal
            {...this.props}
            onClose={this.onUploadImageModalClose}
            isVisible={isUploadImageModalVisible}
            item={selectedRow}
            inventoriesList={getFilteredList(assignmentListKeys, assignmentList)}
          />
        ) : null}
      </div>
    );
  }
}
