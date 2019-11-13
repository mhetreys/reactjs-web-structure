import React from 'react';
import classnames from 'classnames';
import Select from 'react-select';
import { toastr } from 'react-redux-toastr';
import { DatetimePickerTrigger } from 'rc-datetime-picker';
import moment from 'moment';

import InventoryPricingDisplayModal from '../Modals/InventoryPricingDisplayModal';

const getFilteredSupplierList = (list, supplierId) => {
  if (supplierId) {
    return list.filter((supplier) => supplier.supplier_type_id === supplierId);
  } else {
    return list;
  }
};

const getInventoryAttributes = (inventoryList, counts) => {
  const countById = {};

  if (counts && counts.length) {
    for (let i = 0, l = counts.length; i < l; i += 1) {
      if (!countById[counts[i].id]) countById[counts[i].id] = {};

      countById[counts[i].id] = counts[i];
    }
  }

  if (inventoryList && inventoryList.length) {
    return inventoryList.map((item) => {
      if (countById[item._id]) return countById[item._id];
      else
        return {
          id: item._id,
          name: item.name,
          pricing: item.pricing,
          count: 1,
          negotiated_pricing: {},
        };
    });
  }

  return [];
};

const getDropdownOption = (options, value) => {
  if (options) {
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].value === value) {
        return options[i];
      }
    }
  }

  return null;
};

const getMultiselectOptions = (options, values) => {
  if (!values) return [];

  const newOptions = [];
  for (let i = 0, l = options.length; i < l; i += 1) {
    if (values.indexOf(options[i].value) !== -1) {
      newOptions.push(options[i]);
    }
  }

  return newOptions;
};

export default class EditBooking extends React.Component {
  constructor(props) {
    super(props);

    const bookingId = this.getBookingId();
    const booking = this.getBookingById({
      id: bookingId,
    });

    let attributes = [];
    let bookingTemplate = {};
    let supplier = {};
    let phase = {};
    let inventories = [];
    let comment = undefined;
    if (bookingId && booking && booking.id) {
      attributes = booking.booking_attributes;
      bookingTemplate = this.getBookingTemplateById({
        id: booking.booking_template_id,
      });
      supplier = this.getSupplierById({ id: booking.supplier_id });
      inventories = getInventoryAttributes(supplier.inventory_list, booking.inventory_counts);
      phase = this.getPhaseById({ id: booking.phase_id });
    }

    this.state = {
      isEditMode: !!bookingId,
      bookingId,
      errors: {},
      bookingTemplateId: booking.booking_template_id,
      bookingTemplate,
      supplier,
      supplierId: booking.supplier_id,
      attributes,
      inventories,
      phase,
      isInventoryPricingModalVisible: false,
      selectedInventory: {},
      comment,
    };

    this.onBookingTemplateChange = this.onBookingTemplateChange.bind(this);
    this.onPhaseChange = this.onPhaseChange.bind(this);
    this.onSupplierChange = this.onSupplierChange.bind(this);
    this.renderBookingAttributeRow = this.renderBookingAttributeRow.bind(this);
    this.handleAttributeChange = this.handleAttributeChange.bind(this);
    this.handleCommentInputChange = this.handleCommentInputChange.bind(this);
    this.renderInventoryRow = this.renderInventoryRow.bind(this);
    this.handleInventoryChange = this.handleInventoryChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.onBack = this.onBack.bind(this);
  }

  componentDidMount() {
    const {
      getBookingTemplateList,
      getSupplierList,
      getBookingList,
      getPhaseList,
      getCampaignsList,
    } = this.props;
    getBookingTemplateList();
    getSupplierList();
    getBookingList({ campaignId: this.getCampaignId() });
    getPhaseList({ campaignId: this.getCampaignId() });
    getCampaignsList();
  }

  componentDidUpdate(prevProps) {
    const { booking: prevBooking, supplier: prevSupplier, phase: prevPhase } = prevProps;
    const { booking: newBooking, supplier: newSupplier, phase: newPhase, history } = this.props;

    if (
      prevBooking.isCreatingBooking &&
      !newBooking.isCreatingBooking &&
      newBooking.postBookingSuccess
    ) {
      toastr.success('', 'Booking created successfully');
      history.push(`/r/booking/list/${this.getCampaignId()}`);
    } else if (
      prevBooking.isCreatingBooking &&
      !newBooking.isCreatingBooking &&
      newBooking.putBookingError
    ) {
      toastr.error('', 'Failed to create booking. Please try again later.');
    } else if (
      prevBooking.isUpdatingBooking &&
      !newBooking.isUpdatingBooking &&
      newBooking.putBookingSuccess
    ) {
      toastr.success('', 'Booking updated successfully');
      history.push(`/r/booking/list/${this.getCampaignId()}`);
    } else if (
      prevBooking.isUpdatingBooking &&
      !newBooking.isUpdatingBooking &&
      newBooking.putBookingError
    ) {
      toastr.error('', 'Failed to update Booking. Please try again later.');
    } else if (prevBooking.isUploadingImage && !newBooking.isUploadingImage) {
      if (newBooking.uploadImageSuccess) {
        toastr.success('', 'Image uploaded successfully');
      } else {
        toastr.error('', 'Failed to upload image!');
      }
    }

    if (
      (prevBooking.isFetchingBookingTemplate && !newBooking.isFetchingBookingTemplate) ||
      (prevSupplier.isFetchingSupplierList && !newSupplier.isFetchingSupplierList) ||
      (prevBooking.isFetchingBooking && !newBooking.isFetchingBooking)
    ) {
      const bookingId = this.getBookingId();
      const booking = this.getBookingById({
        id: bookingId,
      });

      let attributes = [];
      let bookingTemplate = {};
      let supplier = {};
      let phase = {};
      let inventories = [];
      if (bookingId && booking && booking.id) {
        attributes = booking.booking_attributes;
        bookingTemplate = this.getBookingTemplateById({
          id: booking.booking_template_id,
        });
        supplier = this.getSupplierById({ id: booking.supplier_id });
        inventories = getInventoryAttributes(supplier.inventory_list, booking.inventory_counts);
        phase = this.getPhaseById({ id: booking.phase_id });
      }

      this.setState({
        isEditMode: !!bookingId,
        bookingId,
        bookingTemplateId: booking.booking_template_id,
        bookingTemplate,
        supplier,
        supplierId: booking.supplier_id,
        attributes,
        inventories,
        phase,
      });
    }

    if (prevPhase.isFetchingPhase && !newPhase.isFetchingPhase) {
      const bookingId = this.getBookingId();
      const booking = this.getBookingById({
        id: bookingId,
      });

      this.setState({
        phase: this.getPhaseById({ id: booking.phase_id }),
      });
    }
  }

  // handleInputChange(name) {
  //   this.setState({
  //     name
  //   });
  // }

  onBookingTemplateChange(template) {
    this.setState({
      bookingTemplate: template,
      bookingTemplateId: template.id,
      supplierId: template.supplier_type_id,
      attributes: template.booking_attributes,
    });
  }

  onSupplierChange(supplier) {
    const booking = this.getBookingById({
      id: this.state.bookingId,
    });

    this.setState({
      supplier: supplier,
      inventories: getInventoryAttributes(supplier.inventory_list, booking.inventory_counts),
    });
  }

  onPhaseChange(phase) {
    this.setState({
      phase,
    });
  }

  handleCommentInputChange(event) {
    this.setState({
      comment: event.target.value,
    });
  }

  handleAttributeChange(attribute, index) {
    const attributes = [...this.state.attributes];

    attributes[index] = attribute;

    this.setState({
      attributes,
    });
  }

  handleInventoryChange(inventory, index) {
    const inventories = [...this.state.inventories];

    inventories[index] = inventory;

    this.setState({
      inventories,
    });
  }

  handlePricingModify = ({ inventory }) => {
    this.setState({
      selectedInventory: inventory,
      isInventoryPricingModalVisible: true,
    });
  };

  onInventoryPricingModalClose = () => {
    this.setState({
      isInventoryPricingModalVisible: false,
    });
  };

  onInventoryPricingChange = (inventory, pricing) => {
    const { inventories } = this.state;

    for (let i = 0, l = inventories.length; i < l; i += 1) {
      if (inventories[i].id === inventory.id) {
        inventories[i].negotiated_pricing = pricing;
        break;
      }
    }

    this.setState({
      inventories,
    });
  };

  handleDateChange(date, index) {
    const { attributes } = this.state;
    attributes[index].value = date.format('YYYY-MM-DD');
    this.setState({
      attributes,
    });
  }

  handleImageChange(event) {
    this.setState({
      uploadedImage: event.target.files[0],
    });
  }

  onBack() {
    const { match } = this.props;
    this.props.history.push(`/r/booking/list/${this.getCampaignId()}`);
  }

  onUpload(index) {
    const { supplier, attributes, bookingId, isEditMode, uploadedImage, comment } = this.state;
    const { uploadHashtagImage } = this.props;

    let data = new FormData();
    data.append('file', uploadedImage);
    data.append('supplier_id', supplier.id);
    data.append('campaign_id', this.getCampaignId());
    data.append('hashtag', attributes[index].value);
    data.append('name', attributes[index].name);
    data.append('comment', comment);

    if (isEditMode) {
      uploadHashtagImage({ id: bookingId, data });
      this.setState({
        uploadedImage: undefined,
      });
    }
  }

  onSubmit() {
    const {
      bookingTemplateId,
      bookingTemplate,
      supplier,
      attributes,
      isEditMode,
      bookingId,
      inventories,
      phase,
    } = this.state;
    const { postBooking, putBooking } = this.props;

    const data = {
      booking_template_id: bookingTemplateId,
      supplier_id: supplier.id,
      campaign_id: this.getCampaignId(),
      organisation_id: bookingTemplate.organisation_id,
      booking_attributes: attributes,
      inventory_counts: inventories,
      phase_id: phase.id,
    };

    if (isEditMode) {
      putBooking({ id: bookingId, data });
    } else {
      postBooking({ data });
    }
  }

  getCampaignId() {
    const { match } = this.props;
    return match.params.campaignId;
  }

  getBookingId() {
    const { match } = this.props;
    return match.params.bookingId;
  }

  getBookingById({ id }) {
    const { booking } = this.props;
    const { bookingList } = booking;

    for (let i = 0, l = bookingList.length; i < l; i += 1) {
      if (bookingList[i].id === id) {
        return bookingList[i];
      }
    }

    return {};
  }

  getBookingTemplateById({ id }) {
    const { booking } = this.props;
    const { bookingTemplateList, bookingList } = booking;

    for (let i = 0, l = bookingTemplateList.length; i < l; i += 1) {
      if (bookingTemplateList[i].id === id) {
        return bookingTemplateList[i];
      }
    }

    return {};
  }

  getSupplierById({ id }) {
    const { supplier } = this.props;
    const { supplierList } = supplier;

    for (let i = 0, l = supplierList.length; i < l; i += 1) {
      if (supplierList[i].id === id) {
        return supplierList[i];
      }
    }

    return {};
  }

  getPhaseById({ id }) {
    const { phase } = this.props;
    const { phaseList } = phase;

    for (let i = 0, l = phaseList.length; i < l; i += 1) {
      if (phaseList[i].id === id) {
        return phaseList[i];
      }
    }

    return {};
  }

  renderBookingAttributeRow(attribute, index) {
    const { isEditMode, uploadedImage } = this.state;
    const handleAttributeInputChange = (event) => {
      const newAttribute = { ...attribute };

      if (newAttribute.type === 'DROPDOWN' || newAttribute.type === 'HASHTAG') {
        newAttribute.value = event.value;
      } else if (newAttribute.type === 'MULTISELECT') {
        newAttribute.value = event.map((item) => item.value);
      } else {
        newAttribute.value = event.target.value;
      }

      this.handleAttributeChange(newAttribute, index);
    };

    let typeInput = null;

    switch (attribute.type) {
      case 'FLOAT':
      case 'INT':
        typeInput = (
          <input type="number" onChange={handleAttributeInputChange} value={attribute.value} />
        );
        break;

      case 'STRING':
      case 'BOOLEAN':
        typeInput = (
          <input type="text" onChange={handleAttributeInputChange} value={attribute.value} />
        );
        break;

      case 'DROPDOWN': {
        const options = attribute.options.map((option) => ({
          label: option,
          value: option,
        }));
        typeInput = (
          <Select
            className={classnames('select')}
            options={options}
            getOptionValue={(option) => option.label}
            getOptionLabel={(option) => option.value}
            onChange={handleAttributeInputChange}
            value={getDropdownOption(options, attribute.value)}
          />
        );
        break;
      }

      case 'EMAIL':
        typeInput = (
          <input type="email" onChange={handleAttributeInputChange} value={attribute.value} />
        );
        break;

      case 'MULTISELECT': {
        const options = attribute.options.map((option) => ({
          label: option,
          value: option,
        }));
        typeInput = (
          <Select
            className={classnames('select')}
            options={options}
            getOptionValue={(option) => option.label}
            getOptionLabel={(option) => option.value}
            onChange={handleAttributeInputChange}
            value={getMultiselectOptions(options, attribute.value)}
            isMulti
          />
        );
        break;
      }

      case 'HASHTAG': {
        const options = attribute.options.map((option) => ({
          label: option,
          value: option,
        }));
        typeInput = (
          <div>
            <div className="form-control">
              <input
                type="file"
                id="uploadedImage"
                accept="image/png, image/jpeg"
                onChange={this.handleImageChange}
              />
            </div>
            <div>
              <br />
              <Select
                className={classnames('select')}
                options={options}
                getOptionValue={(option) => option.label}
                getOptionLabel={(option) => option.value}
                onChange={handleAttributeInputChange}
                value={getDropdownOption(options, attribute.value)}
              />
            </div>
            <div>
              <input
                type="text"
                onChange={this.handleCommentInputChange}
                placeholder="Enter comments "
              />
            </div>
            <div>
              <button
                type="button"
                className="btn btn--danger"
                onClick={() => this.onUpload(index)}
                disabled={!uploadedImage}
              >
                Upload
              </button>
            </div>
          </div>
        );
        break;
      }

      case 'DATETIME':
        typeInput = (
          <DatetimePickerTrigger
            key={index}
            moment={moment(attribute.value)}
            onChange={(e) => this.handleDateChange(e, index)}
          >
            <input type="text" value={attribute.value || ''} readOnly />
          </DatetimePickerTrigger>
        );
        break;
      default:
        console.log('Unsupported attribute type', attribute.type);
        break;
    }

    return (
      <div className="supplier" key={index}>
        <div className="form-control">&nbsp;</div>
        {!isEditMode && attribute.type == 'HASHTAG' ? null : (
          <div className="form-control">
            <p>
              {attribute.name}
              {attribute.is_required ? <span style={{ color: '#e2402e' }}>*</span> : null}
            </p>
          </div>
        )}
        {!isEditMode && attribute.type == 'HASHTAG' ? null : (
          <div className="form-control">{typeInput}</div>
        )}
      </div>
    );
  }

  renderInventoryRow(inventory, index) {
    const { isEditMode } = this.state;
    const onCountChange = (event) => {
      if (event.target.value && !isNaN(+event.target.value) && +event.target.value >= 0) {
        const newInventory = { ...inventory, count: +event.target.value };

        this.handleInventoryChange(newInventory, index);
      }
    };

    const onPricingChange = () => {
      this.handlePricingModify({ inventory });
    };

    return (
      <div className="supplier" key={index}>
        <div className="form-control">&nbsp;</div>
        <div className="form-control">
          <p>{inventory.name}</p>
        </div>

        <div className="form-control">
          <input
            type="number"
            onChange={onCountChange}
            value={inventory.count}
            disabled={isEditMode}
          />
        </div>

        <div className="form-control">
          <button type="button" className="btn btn--danger" onClick={onPricingChange}>
            Change
          </button>
        </div>
      </div>
    );
  }

  render() {
    const { errors, attributes, inventories, isEditMode } = this.state;
    const { booking, supplier, phase } = this.props;
    const { supplierList } = supplier;
    const { bookingTemplateList, bookingList } = booking;
    const { phaseList } = phase;
    const filterSupplierList = getFilteredSupplierList(supplierList, this.state.supplierId);

    const templateList = [];

    const suppliers = bookingList.map((supplier) => supplier.supplier_id);
    const filteredSuppliers = filterSupplierList.filter(
      (supplier) => suppliers.indexOf(supplier.id) === -1
    );

    for (let i = 0; i < bookingTemplateList.length; i++) {
      if (bookingList.length && bookingList[0].booking_template_id === bookingTemplateList[i].id) {
        templateList.push(bookingTemplateList[i]);
        break;
      }
    }

    let campaignName = '';
    const { campaign } = this.props;
    let campaignId = this.getCampaignId();
    if (campaign && campaign.objectById && campaign.objectById[campaignId]) {
      campaignName = campaign.objectById[campaignId].name;
    }

    return (
      <div className="booking-base__create create">
        <div className="create__title">
          {isEditMode ? (
            <h3>Booking - Edit ({campaignName})</h3>
          ) : (
            <h3>Booking - Add ({campaignName})</h3>
          )}
        </div>

        <div className="create__form">
          <form onSubmit={this.onSubmit}>
            <div className="create__form__body">
              <button type="button" className="btn btn--danger" onClick={this.onBack}>
                <i className="fa fa-arrow-left" aria-hidden="true" />
                &nbsp; Back
              </button>
              <br />
              <br />
              {/*<div className="form-control form-control--column">
                <label>*Enter Name For Booking</label>
                <input
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleInputChange}
                  className={classnames({ error: errors.name })}
                />
                {errors.name ? (
                  <p className="message message--error">
                    {errors.name.message}
                  </p>
                ) : null}
              </div>*/}
            </div>

            <div className="create__form__header">Select Booking Template</div>

            <div className="create__form__body">
              <div className="form-control form-control--column">
                {bookingList.length ? (
                  <Select
                    className={classnames('select', {
                      error: errors.bookingTemplateId,
                    })}
                    options={templateList}
                    getOptionValue={(option) => option.id}
                    getOptionLabel={(option) => option.name}
                    value={this.state.bookingTemplate}
                    onChange={this.onBookingTemplateChange}
                  />
                ) : (
                  <Select
                    className={classnames('select', {
                      error: errors.bookingTemplateId,
                    })}
                    options={bookingTemplateList}
                    getOptionValue={(option) => option.id}
                    getOptionLabel={(option) => option.name}
                    value={this.state.bookingTemplate}
                    onChange={this.onBookingTemplateChange}
                  />
                )}
                {errors.bookingTemplateId ? (
                  <p className="message message--error">{errors.bookingTemplateId.message}</p>
                ) : null}
              </div>

              {attributes && attributes.length ? (
                <div className="supplier supplier__header">
                  <div className="form-control">&nbsp;</div>
                  <div className="form-control">
                    <h4>Field</h4>
                  </div>

                  <div className="form-control">
                    <h4>Type</h4>
                  </div>
                </div>
              ) : null}

              {attributes && attributes.length
                ? attributes.map(this.renderBookingAttributeRow)
                : null}
            </div>

            <div className="create__form__header">Select supplier</div>

            <div className="create__form__body">
              <div className="form-control form-control--column">
                <Select
                  className={classnames('select', {
                    error: errors.supplier,
                  })}
                  options={filteredSuppliers}
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.name}
                  value={this.state.supplier}
                  onChange={this.onSupplierChange}
                  isDisabled={isEditMode}
                />
                {errors.supplier ? (
                  <p className="message message--error">{errors.supplier.message}</p>
                ) : null}
              </div>

              {inventories && inventories.length ? (
                <div className="supplier supplier__header">
                  <div className="form-control">&nbsp;</div>
                  <div className="form-control">
                    <h4>Inventory</h4>
                  </div>

                  <div className="form-control">
                    <h4>Count</h4>
                  </div>

                  <div className="form-control">
                    <h4>Pricing</h4>
                  </div>
                </div>
              ) : null}

              {inventories && inventories.length ? inventories.map(this.renderInventoryRow) : null}
            </div>

            <div className="create__form__header">Select phase</div>

            <div className="create__form__body">
              <div className="form-control form-control--column">
                <Select
                  className={classnames('select', {
                    error: errors.phaseId,
                  })}
                  options={phaseList}
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.phase_no}
                  value={this.state.phase}
                  onChange={this.onPhaseChange}
                />
                {errors.phaseId ? (
                  <p className="message message--error">{errors.phaseId.message}</p>
                ) : null}
              </div>
            </div>
          </form>
        </div>

        <div className="create__actions">
          <button type="button" className="btn btn--danger" onClick={this.onSubmit}>
            Submit
          </button>
        </div>

        <InventoryPricingDisplayModal
          key={this.state.selectedInventory.id}
          isVisible={this.state.isInventoryPricingModalVisible}
          inventory={this.state.selectedInventory}
          onChange={this.onInventoryPricingChange}
          onClose={this.onInventoryPricingModalClose}
        />
      </div>
    );
  }
}
