import React from 'react';
import Modal from 'react-modal';
import { DatetimePickerTrigger } from 'rc-datetime-picker';
import Select from 'react-select';
import moment from 'moment';
import FormData from 'form-data';
import { toastr } from 'react-redux-toastr';

import './index.css';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    width: '60%',
    transform: 'translate(-50%, -50%)',
  },
};

const ActivityTypes = [
  { value: 'RELEASE', label: 'Release' },
  { value: 'AUDIT', label: 'Audit' },
  { value: 'CLOSURE', label: 'Closure' },
  { value: 'ALL', label: 'All' },
];

const getSupplierById = (list, id) => {
  for (let i = 0, l = list.length; i < l; i += 1) {
    // eslint-disable-next-line
    if (list[i].id === id) {
      return list[i];
    }
  }

  return {};
};

const getActivityType = (list, value) => {
  for (let i = 0, l = list.length; i < l; i += 1) {
    // eslint-disable-next-line
    if (list[i].value === value) {
      return list[i];
    }
  }
};

export default class UploadImageModal extends React.Component {
  constructor(props) {
    super(props);
    const { supplier, item } = props;

    this.state = {
      activityType: getActivityType(ActivityTypes, item.activity_type),
      selectedSupplier: getSupplierById(supplier.supplierList, item.supplier_id),
      activityDate: moment(item.activity_date),
      actualActivityDate: item.actual_activity_date ? moment(item.actual_activity_date) : moment(),
      uploadedImage: {},
      inventory: item,
      comment: '',
    };

    this.handleActivityChange = this.handleActivityChange.bind(this);
    this.handleSupplierChange = this.handleSupplierChange.bind(this);
    this.handleActivityDateChange = this.handleActivityDateChange.bind(this);
    this.handleActualActivityDateChange = this.handleActualActivityDateChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.getSupplierInventories = this.getSupplierInventories.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleInventoryChange = this.handleInventoryChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { booking: prevBooking } = prevProps;
    const { booking: newBooking, onClose } = this.props;

    if (prevBooking.isUploadingImage && !newBooking.isUploadingImage) {
      if (newBooking.uploadImageSuccess) {
        toastr.success('', 'Image uploaded successfully');
        onClose();
      } else {
        toastr.error('', 'Failed to upload image!');
      }
    }
  }

  getSupplierInventories(supplierId, activityType) {
    const { inventoriesList } = this.props;

    return inventoriesList.filter(
      (item) =>
        supplierId === item.supplier_id &&
        (activityType === 'ALL' || activityType === item.activity_type)
    );
  }

  handleInventoryChange(inventory) {
    this.setState({
      inventory,
    });
  }

  handleCommentChange(event) {
    this.setState({
      comment: event.target.value,
    });
  }

  handleImageChange(event) {
    this.setState({
      uploadedImage: event.target.files[0],
    });
  }

  handleActualActivityDateChange(date) {
    this.setState({
      actualActivityDate: { date },
    });
  }

  handleActivityDateChange(date) {
    this.setState({
      activityDate: date,
    });
  }

  handleActivityChange(type) {
    this.setState({
      activityType: type,
      inventory: null,
    });
  }

  handleSupplierChange(supplier) {
    this.setState({
      selectedSupplier: supplier,
      inventory: null,
    });
  }

  onSubmit() {
    const { uploadImage } = this.props;

    const {
      activityType,
      selectedSupplier,
      activityDate,
      actualActivityDate,
      uploadedImage,
      inventory,
      comment,
    } = this.state;

    let form = new FormData();
    form.append('file', uploadedImage);
    form.append('supplier_name', selectedSupplier.name);
    form.append('activity_type', activityType.value);
    form.append('actual_activity_date', moment(actualActivityDate).format('YYYY-MM-DD'));
    form.append('inventory_name', inventory.inventory_name);
    form.append('booking_inventory_activity_id', inventory.id);
    form.append('lat', 51.509669);
    form.append('long', 12.376294);
    form.append('activity_date', moment(activityDate).format('YYYY-MM-DD'));
    form.append('comment', comment);

    uploadImage(form);
  }

  render() {
    const { isVisible, onClose, supplier } = this.props;

    const {
      activityType,
      selectedSupplier,
      activityDate,
      actualActivityDate,
      inventory,
      comment,
    } = this.state;

    return (
      <Modal isOpen={isVisible} style={customStyles} ariaHideApp={false}>
        <div className="modal upload-image">
          <div className="modal__header">
            <h3>Upload Image</h3>
          </div>
          <div className="modal__body">
            <form>
              <div className="upload-image__group">
                <div className="form-control">
                  <Select
                    className="select"
                    options={supplier.supplierList}
                    getOptionValue={(option) => option.id}
                    getOptionLabel={(option) => option.name}
                    onChange={this.handleSupplierChange}
                    value={selectedSupplier}
                    placeholder="Supplier Name"
                  />
                </div>
                <div className="form-control">
                  <Select
                    className="select"
                    options={ActivityTypes}
                    getOptionValue={(option) => option.value}
                    getOptionLabel={(option) => option.label}
                    onChange={this.handleActivityChange}
                    value={activityType}
                    placeholder="Activity Type"
                  />
                </div>
                <div className="form-control">
                  <Select
                    className="select"
                    options={this.getSupplierInventories(selectedSupplier.id, activityType.value)}
                    getOptionValue={(option) => option.id}
                    getOptionLabel={(option) => option.inventory_name}
                    onChange={this.handleInventoryChange}
                    value={inventory}
                    placeholder="Inventory Name"
                  />
                </div>
                <div className="form-control">
                  <DatetimePickerTrigger
                    moment={activityDate}
                    onChange={this.handleActivityDateChange}
                    className="date-time-picker"
                  >
                    <input
                      type="text"
                      readOnly
                      placeholder="Activity Date"
                      value={activityDate.format('YYYY-MM-DD')}
                    />
                  </DatetimePickerTrigger>
                </div>
                <div className="form-control">
                  <DatetimePickerTrigger
                    moment={actualActivityDate}
                    onChange={this.handleActualActivityDateChange}
                  >
                    <input
                      type="text"
                      readOnly
                      placeholder="Actual Activity Date"
                      value={actualActivityDate.format('YYYY-MM-DD')}
                    />
                  </DatetimePickerTrigger>
                </div>
                <div className="form-control">
                  <input
                    type="file"
                    id="uploadedImage"
                    accept="image/png, image/jpeg"
                    onChange={this.handleImageChange}
                  />
                </div>
              </div>
              <div className="upload-image__group">
                <div className="form-control full-width">
                  <textarea
                    id="comment"
                    name="comment"
                    rows="1"
                    onChange={this.handleCommentChange}
                    value={comment}
                    placeholder="Add comment"
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
