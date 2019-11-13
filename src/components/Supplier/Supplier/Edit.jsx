import React from 'react';
import Select from 'react-select';
import { toastr } from 'react-redux-toastr';
import { DatetimePickerTrigger } from 'rc-datetime-picker';

import OptionModal from '../../Modals/OptionModal';
import FillSupplierModal from '../../Modals/FillSupplierModal';
import FillInventoryModal from '../../Modals/FillInventoryModal';
import FillAdditionalAttributeModal from '../../Modals/AdditionalAttributesModal';
import moment from 'moment';

const customeStyles = {
  input: () => ({
    height: '24px',
  }),
};

const getOption = (options, value, { optionValueKey }) => {
  if (!options || !options.length) return {};

  for (let i = 0, l = options.length; i < l; i += 1) {
    if (options[i][optionValueKey] === value) {
      return options[i];
    }
  }

  return {};
};

const additional_attributes_dict = {
  bank_details: [
    { name: 'Name for Payment', type: 'STRING', is_required: true },
    { name: 'Account Number', type: 'STRING', is_required: true },
    { name: 'Bank Name', type: 'STRING', is_required: true },
    { name: 'IFSC Code', type: 'STRING', is_required: true },
    { name: 'cheque number', type: 'STRING', is_required: true },
  ],
  contact_details: [
    { name: 'Name', type: 'STRING', is_required: true },
    { name: 'Designation', type: 'STRING', is_required: true },
    { name: 'Department', type: 'STRING', is_required: true },
    { name: 'Mobile Number', type: 'STRING', is_required: true },
    { name: 'Email', type: 'STRING', is_required: true },
    { name: 'MPOC', type: 'STRING', is_required: true },
    { name: 'Landline Number', type: 'STRING', is_required: true },
    { name: 'STD Code', type: 'STRING', is_required: true },
    { name: 'Decision Maker', type: 'STRING', is_required: true },
    { name: 'Comments', type: 'STRING', is_required: true },
  ],
  location_details: [
    { name: 'Address', type: 'STRING', is_required: true },
    { name: 'Landmark', type: 'STRING', is_required: true },
    { name: 'Area', type: 'DROPDOWN', is_required: true, options: [] },
    { name: 'Sub Area', type: 'DROPDOWN', is_required: true, options: [] },
    { name: 'City', type: 'DROPDOWN', is_required: true, options: [] },
    { name: 'State', type: 'DROPDOWN', is_required: true, options: [] },
    { name: 'Pincode', type: 'STRING', is_required: true },
    { name: 'Latitude', type: 'STRING', is_required: true },
    { name: 'Longitude', type: 'STRING', is_required: true },
  ],
  society_details: [
    { name: 'FlatCount', type: 'FLOAT', is_required: true },
    { name: 'TowerCount', type: 'FLOAT', is_required: true },
    {
      name: 'QualityType',
      type: 'DROPDOWN',
      is_required: true,
      options: ['Standard', 'Medium High', 'High', 'Ultra High'],
    },
    { name: 'AverageHouseholdOccupant', type: 'FLOAT', is_required: true },
    { name: 'BachelorTenantsAllowed', type: 'DROPDOWN', is_required: true, options: ['Yes', 'No'] },
  ],
};

export default class CreateSupplier extends React.Component {
  constructor(props) {
    super(props);

    const supplierId = this.getSupplierId();

    this.state = {
      isEditMode: !!supplierId,
      supplierId,
      name: '',
      supplier_attributes: [],
      inventory_list: [],
      additional_attributes: {},
      supplierTypeOption: [],
      selectedSupplierType: {},
      attributeValue: [],
      showOptionModal: false,
      attributeValueOptions: [''],
      attributeValueInfo: {},
      showFillSupplierModal: false,
      currentModalSupplierType: undefined,
      isFillInventoryModalVisible: false,
      selectedInventory: {},
      selectedAdditionalAttribute: {},
      selectedFieldName: undefined,
      additionalAttributesList: [
        { label: 'Bank Details', value: 'bank_details' },
        { label: 'Contact Details', value: 'contact_details' },
        { label: 'Location Details', value: 'location_details' },
        { label: 'Society Details', value: 'society_details' },
      ],
    };

    this.renderAttributeRow = this.renderAttributeRow.bind(this);
    this.renderAdditionalAttributeRow = this.renderAdditionalAttributeRow.bind(this);
    this.handleAttributeChange = this.handleAttributeChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSelectSupplierType = this.onSelectSupplierType.bind(this);
    this.onCancelOptionModal = this.onCancelOptionModal.bind(this);
    this.onSubmitOptionModal = this.onSubmitOptionModal.bind(this);
    this.onOpenOptionModal = this.onOpenOptionModal.bind(this);
    this.onCancelFillSupplierModal = this.onCancelFillSupplierModal.bind(this);
    this.onSubmitFillSupplierModal = this.onSubmitFillSupplierModal.bind(this);
    this.onOpenFillSupplierModal = this.onOpenFillSupplierModal.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onAdditionalAttributeChange = this.onAdditionalAttributeChange.bind(this);
    this.onAddAdditionalAttributes = this.onAddAdditionalAttributes.bind(this);
    this.onAddInventory = this.onAddInventory.bind(this);
  }

  componentDidMount() {
    const { isEditMode, supplierId } = this.state;

    this.props.getSupplierTypeList();
    this.props.getInventoryList();

    if (isEditMode) {
      this.props.getSupplier(supplierId);
    }
  }

  componentDidUpdate(prevProps) {
    const { supplier: prevSupplier } = prevProps;
    const { supplier: newSupplier } = this.props;

    const { location: prevLocation } = prevProps;
    const { location: newLocation } = this.props;

    const newState = {};

    if (this.state.supplierTypeOption.length !== this.props.supplierType.supplierTypeList.length) {
      let supplierTypeOption = [];
      this.props.supplierType.supplierTypeList.forEach((supplierType) => {
        supplierTypeOption.push({
          value: supplierType.id,
          label: supplierType.name,
        });
      });

      newState.supplierTypeOption = supplierTypeOption;

      if (newSupplier.currentSupplier) {
        newState.selectedSupplierType = getOption(
          supplierTypeOption,
          newSupplier.currentSupplier.supplier_type_id,
          { optionValueKey: 'value' }
        );
      }
    }

    if (this.state.isEditMode && !prevSupplier.currentSupplier && newSupplier.currentSupplier) {
      newState.name = newSupplier.currentSupplier.name;
      newState.selectedSupplierType = getOption(
        this.state.supplierTypeOption,
        newSupplier.currentSupplier.supplier_type_id,
        { optionValueKey: 'value' }
      );
      newState.supplier_attributes = newSupplier.currentSupplier.supplier_attributes;
      newState.inventory_list = newSupplier.currentSupplier.inventory_list;
      newState.additional_attributes = newSupplier.currentSupplier.additional_attributes;
    }

    if (Object.keys(newState).length) {
      this.setState(newState);
    }
  }

  onCancelFillSupplierModal() {
    this.setState({
      showFillSupplierModal: false,
      currentModalSupplierType: undefined,
    });
  }

  onSubmitFillSupplierModal(currentModalSupplierType, attributeInfo) {
    this.setState({
      showFillSupplierModal: false,
      currentModalSupplierType: undefined,
      attributeValueInfo: {},
    });

    let newAttributes = Object.assign({}, attributeInfo.attribute, {
      value: currentModalSupplierType,
    });

    this.handleAttributeChange(newAttributes, attributeInfo.attrIndex);
  }

  onOpenFillSupplierModal(currentModalSupplierType, attribute, attrIndex) {
    this.setState({
      showFillSupplierModal: true,
      currentModalSupplierType,
      attributeValueInfo: {
        attribute,
        attrIndex,
      },
    });
  }

  onFillInventoryModalClick = (inventory) => {
    this.setState({
      isFillInventoryModalVisible: true,
      selectedInventory: inventory,
    });
  };

  onFillAdditionalAttributeModalClick = (attributes, attribute) => {
    this.props.getStates();

    this.setState({
      isAdditionalAttributeModalVisible: true,
      selectedAdditionalAttribute: attributes[attribute],
      selectedFieldName: attribute,
    });
  };

  onFillInventoryModalClose = () => {
    this.setState({
      isFillInventoryModalVisible: false,
      selectedInventory: {},
    });
  };

  onFillAdditionalAttributeModalClose = () => {
    this.setState({
      isAdditionalAttributeModalVisible: false,
      selectedAdditionalAttribute: {},
    });
  };

  onInventoryChange = (selectedInventory) => {
    this.setState({
      selectedInventory,
    });
    // const { inventory_list } = this.state;

    // let isMatched = false;

    // for (let i = 0, l = inventory_list.length; i < l; i += 1) {
    //   if (inventory._id === inventory_list[i]._id) {
    //     inventory_list[i] = { ...inventory };
    //     isMatched = true;
    //     break;
    //   }
    // }

    // if (!isMatched) {
    //   inventory_list.push(inventory);
    // }

    // this.setState({
    //   inventory_list,
    // });
  };

  onAddInventory() {
    const { inventory_list, selectedInventory } = this.state;
    if (Object.keys(selectedInventory).length == 0) {
      return;
    }
    inventory_list.push(selectedInventory);

    this.setState({
      inventory_list,
      selectedInventory: {},
    });
  }

  // onAdditionalAttributeChange = (inventory) => {
  //   console.log(inventory);
  //   const { additional_attributes, selectedFieldName } = this.state;
  //   console.log(selectedFieldName);
  //   let isMatched = false;

  //   // for (let i = 0, l = additional_attributes.length; i < l; i += 1) {
  //   //   if (inventory._id === inventory_list[i]._id) {
  //   //     inventory_list[i] = { ...inventory };
  //   //     isMatched = true;
  //   //     break;
  //   //   }
  //   // }
  //   //
  //   // if (!isMatched) {
  //   //   inventory_list.push(inventory);
  //   // }
  //   //
  //   // this.setState({
  //   //   inventory_list,
  //   // });
  // };

  onAdditionalAttributeChange(selectedAdditionalAttribute) {
    this.setState({
      selectedAdditionalAttribute,
    });
  }

  onAddAdditionalAttributes() {
    const { additional_attributes, selectedAdditionalAttribute } = this.state;
    if (selectedAdditionalAttribute.value == undefined) {
      return;
    }
    additional_attributes[selectedAdditionalAttribute.value] =
      additional_attributes_dict[selectedAdditionalAttribute.value];
    this.setState({
      additional_attributes,
      selectedAdditionalAttribute: {},
    });
  }

  onCancelOptionModal() {
    this.setState({
      showOptionModal: false,
      attributeValueOptions: [''],
      attributeValueInfo: {},
    });
  }

  onSubmitOptionModal(options, attributeInfo) {
    this.setState({
      showOptionModal: false,
      attributeValueOptions: [''],
      attributeValueInfo: {},
    });

    let newAttributes = Object.assign({}, attributeInfo.attribute, {
      value: options,
    });
    this.handleAttributeChange(newAttributes, attributeInfo.attrIndex);
  }

  onOpenOptionModal(options, attribute, attrIndex) {
    this.setState({
      showOptionModal: true,
      attributeValueOptions: options,
      attributeValueInfo: {
        attribute,
        attrIndex,
      },
    });
  }

  onSelectSupplierType(selectedSupplierType) {
    let { supplierTypeList } = this.props.supplierType;
    supplierTypeList.forEach((supplierType) => {
      if (supplierType.id === selectedSupplierType.value) {
        this.setState({
          selectedSupplierType,
          supplier_attributes: supplierType.supplier_attributes,
          inventory_list: supplierType.inventory_list,
          additional_attributes: supplierType.additional_attributes,
        });
        return;
      }
    });
  }

  onBack() {
    const { match } = this.props;
    this.props.history.push(`/r/supplier/list`);
  }

  onSubmit(event) {
    event.preventDefault();

    const { isEditMode, supplierId } = this.state;
    const { history } = this.props;

    let data = {
      name: this.state.name,
      is_custom: false,
      supplier_type_id: this.state.selectedSupplierType.value,
      supplier_attributes: this.state.supplier_attributes,
      inventory_list: this.state.inventory_list,
      additional_attributes: this.state.additional_attributes,
    };

    if (isEditMode) {
      this.props.updateSupplier({ data, supplierId }, () => {
        toastr.success('', 'Supplier updated successfully');
        history.push('/r/supplier/list');
      });
    } else {
      this.props.postSupplier({ data }, () => {
        toastr.success('', 'Supplier created successfully');
        history.push('/r/supplier/list');
      });
    }
  }

  getSupplierId = () => {
    const { match } = this.props;
    return match.params.supplierId;
  };

  handleAttributeChange(attribute, index) {
    const attributes = this.state.supplier_attributes.slice();

    attributes.splice(index, 1, attribute);

    this.setState({
      supplier_attributes: attributes,
    });
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleDateChange(date, index) {
    const { supplier_attributes } = this.state;
    supplier_attributes[index].value = date.format('YYYY-MM-DD');
    this.setState({
      supplier_attributes,
    });
  }

  renderInputField(attribute, attrIndex) {
    const onValueChange = (event) => {
      const newAttribute = Object.assign({}, attribute);

      if (event.target.type === 'number') {
        newAttribute.value = parseFloat(event.target.value);
      } else {
        newAttribute.value = event.target.value;
      }

      this.handleAttributeChange(newAttribute, attrIndex);
    };

    const onDropDownAttributeValueChange = (newValue) => {
      const newAttribute = Object.assign({}, attribute);

      newAttribute.value = newValue.value;

      this.handleAttributeChange(newAttribute, attrIndex);
    };

    switch (attribute.type) {
      case 'FLOAT':
        return (
          <input
            type="number"
            placeholder="Attribute Value"
            value={attribute.value}
            onChange={onValueChange}
          />
        );
      case 'STRING':
        return (
          <input
            type="text"
            placeholder="Attribute Value"
            value={attribute.value}
            onChange={onValueChange}
          />
        );
      case 'EMAIL':
        return (
          <input
            type="email"
            placeholder="Attribute Value"
            value={attribute.value}
            onChange={onValueChange}
          />
        );
      case 'DROPDOWN':
        let attributeValueOptions = [];
        attribute.options.forEach((option) => {
          attributeValueOptions.push({ label: option, value: option });
        });
        return (
          <Select
            styles={customeStyles}
            options={attributeValueOptions}
            value={{ label: attribute.value, value: attribute.value }}
            onChange={onDropDownAttributeValueChange}
          />
        );
      case 'INVENTORY_TYPE':
        return (
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => this.onOpenFillSupplierModal(attribute.value, attribute, attrIndex)}
          >
            {attribute.value && attribute.value.attributes[0].value
              ? 'Show Base Inventory List'
              : 'Create Base Inventory List'}
          </button>
        );

      case 'INVENTORY':
        return (
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => this.onOpenFillSupplierModal(attribute.value, attribute, attrIndex)}
          >
            {attribute.value && attribute.value.attributes[0].value
              ? 'Show Inventory List'
              : 'Create Inventory List'}
          </button>
        );

      case 'SUPPLIER_TYPE':
        return (
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => this.onOpenFillSupplierModal(attribute.value, attribute, attrIndex)}
          >
            {attribute.value && attribute.value.attributes[0].value
              ? 'Show Supplier Type Data'
              : 'Create Supplier Type Data'}
          </button>
        );
      case 'BASE_SUPPLIER_TYPE':
        return (
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => this.onOpenFillSupplierModal(attribute.value, attribute, attrIndex)}
          >
            {attribute.value && attribute.value.attributes[0].value
              ? 'Show Base Supplier Type Data'
              : 'Create Base Supplier Type Data'}
          </button>
        );
      case 'DATETIME':
        return (
          <DatetimePickerTrigger
            moment={moment(attribute.value)}
            onChange={(e) => this.handleDateChange(e, attrIndex)}
          >
            <input type="text" value={attribute.value} readOnly />
          </DatetimePickerTrigger>
        );
      default:
        return;
    }
  }

  renderAttributeRow(attribute, attrIndex) {
    return (
      <div className="createform__form__row" key={`row-${attrIndex}`}>
        <div className="createform__form__inline">
          <div className="form-control">
            <input type="text" value={attribute.name} disabled />
          </div>

          <div className="form-control">{this.renderInputField(attribute, attrIndex)}</div>
        </div>
      </div>
    );
  }

  renderInventoryRow = (inventory) => {
    return (
      <div className="createform__form__row" key={inventory._id}>
        <div className="createform__form__inline">
          <div className="form-control">{inventory.name}</div>

          <div className="form-control">
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => this.onFillInventoryModalClick(inventory)}
            >
              View / Edit Inventory Attributes
            </button>
          </div>
        </div>
      </div>
    );
  };

  renderAdditionalAttributeRow = (attribute) => {
    const { additional_attributes } = this.state;

    return (
      <div className="createform__form__row" key={additional_attributes[attribute]}>
        <div className="createform__form__inline">
          <div className="form-control">
            {attribute.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function(attribute) {
              return attribute.toUpperCase();
            })}
          </div>

          <div className="form-control">
            <button
              type="button"
              className="btn btn--danger"
              onClick={() =>
                this.onFillAdditionalAttributeModalClick(additional_attributes, attribute)
              }
            >
              View / Edit Additional Attributes
            </button>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { baseInventory, locationData } = this.props;

    const { isEditMode, inventory_list, supplier_attributes, additional_attributes } = this.state;

    const usedInventoryIds = inventory_list.map((item) => item._id);
    const additionalAttributesNames = Object.keys(additional_attributes);
    const additionalAttributesList = this.state.additionalAttributesList.filter(
      (item) => additionalAttributesNames.indexOf(item.value) === -1
    );
    const inventoryList = baseInventory.inventoryList.filter(
      (item) => usedInventoryIds.indexOf(item._id) === -1
    );

    return (
      <div className="createform">
        <div className="createform__title">
          <h3>Supplier - {isEditMode ? 'Edit' : 'Create'}</h3>
        </div>
        <div className="createform__form">
          <form onSubmit={this.onSubmit}>
            <button type="button" className="btn btn--danger" onClick={this.onBack}>
              <i className="fa fa-arrow-left" aria-hidden="true" />
              &nbsp; Back
            </button>
            <br />
            <br />
            <div className="createform__form__inline">
              <div className="form-control">
                <label>*Enter Name For Supplier</label>
                <input
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
            {!isEditMode ? (
              <div className="createform__form__inline">
                <div className="form-control">
                  <label>*Select Supplier Type</label>
                  <Select
                    options={this.state.supplierTypeOption}
                    value={this.state.selectedSupplierType}
                    onChange={this.onSelectSupplierType}
                  />
                </div>
              </div>
            ) : null}
            <div className="createform__form__header">Attributes</div>
            <div>
              {supplier_attributes && supplier_attributes.length ? (
                supplier_attributes.map(this.renderAttributeRow)
              ) : (
                <div className="blank-sttaus">No attributes available</div>
              )}
            </div>
            <div className="createform__form__header">Inventories</div>
            {inventory_list && inventory_list.length ? (
              inventory_list.map(this.renderInventoryRow)
            ) : (
              <div className="blank-sttaus">
                <label htmlFor="">No inventory available</label>
                <br />
                <br />
              </div>
            )}
            <div className="createform__form__header">Add More Inventories</div>
            <div className="createform__form__row">
              <div className="createform__form__inline">
                <div className="form-control">
                  <Select
                    options={inventoryList}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option._id}
                    value={this.state.selectedInventory}
                    onChange={this.onInventoryChange}
                  />
                </div>
              </div>
            </div>
            <div>
              <button className="btn btn--danger" type="button" onClick={this.onAddInventory}>
                Add Inventory
              </button>
            </div>
            <div className="createform__form__header">Additional Attributes</div>
            <div>
              {Object.keys(additional_attributes).length ? (
                Object.keys(additional_attributes).map(this.renderAdditionalAttributeRow)
              ) : (
                <div className="blank-sttaus">
                  <label htmlFor="">No Additional Attributes available</label>
                  <br />
                  <br />
                </div>
              )}
              <div className="createform__form__header">Add More Additional Attributes</div>
              <div className="createform__form__row">
                <div className="createform__form__inline">
                  <div className="form-control">
                    <Select
                      options={additionalAttributesList}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      value={this.state.selectedAdditionalAttribute}
                      onChange={this.onAdditionalAttributeChange}
                    />
                  </div>
                </div>
              </div>

              <button
                className="btn btn--danger"
                type="button"
                onClick={this.onAddAdditionalAttributes}
              >
                Add Additional Attributes
              </button>
            </div>{' '}
            <br />
            <br />
            <div className="createform__form__inline">
              <div className="createform__form__action">
                <button type="submit" className="btn btn--danger">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
        <OptionModal
          key={this.state.attributeValueInfo.attrIndex}
          showOptionModal={this.state.showOptionModal}
          onCancel={this.onCancelOptionModal}
          onSubmit={this.onSubmitOptionModal}
          options={this.state.attributeValueOptions}
          columnInfo={this.state.attributeValueInfo}
        />

        {this.state.showFillSupplierModal ? (
          <FillSupplierModal
            showOptionModal={this.state.showFillSupplierModal}
            onCancel={this.onCancelFillSupplierModal}
            onSubmit={this.onSubmitFillSupplierModal}
            columnInfo={this.state.attributeValueInfo}
            selectedSupplierType={this.state.currentModalSupplierType}
          />
        ) : (
          undefined
        )}

        <FillInventoryModal
          key={this.state.selectedInventory._id}
          isVisible={this.state.isFillInventoryModalVisible}
          inventory={this.state.selectedInventory}
          onChange={this.onInventoryChange}
          onClose={this.onFillInventoryModalClose}
        />

        <FillAdditionalAttributeModal
          key={this.state.selectedAdditionalAttribute}
          isVisible={this.state.isAdditionalAttributeModalVisible}
          attributes={this.state.selectedAdditionalAttribute}
          onChange={this.onAdditionalAttributeChange}
          onClose={this.onFillAdditionalAttributeModalClose}
          locationData={this.props.locationData}
          attribute={this.state.selectedFieldName}
          getCities={(id) => this.props.getCities(id)}
          getAreas={(id) => this.props.getAreas(id)}
          getSubAreas={(id) => this.props.getSubAreas(id)}
        />
      </div>
    );
  }
}
