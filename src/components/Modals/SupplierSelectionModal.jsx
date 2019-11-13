import React from 'react';
import Modal from 'react-modal';
import Select from 'react-select';

import '../Checklist/index.css';
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
    padding: '5px 10px 10px',
    maxHeight: '550px',
    minHeight: '200px',
  },
};

export default class SelectAttributeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      supplierTypeOption: [],
      selectedSupplierType: undefined,
    };
    this.renderOptionRow = this.renderOptionRow.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSelectSupplierType = this.onSelectSupplierType.bind(this);
  }

  componentWillMount() {
    if (this.props.attributeInfo.attributeType === 'SUPPLIER_TYPE') {
      this.props.getSupplierTypeList();
    } else if (this.props.attributeInfo.attributeType === 'BASE_SUPPLIER_TYPE') {
      this.props.getBaseSupplierTypeList();
    } else if (this.props.attributeInfo.attributeType === 'INVENTORY_TYPE') {
      this.props.getBaseInventory();
    } else if (this.props.attributeInfo.attributeType === 'INVENTORY') {
      this.props.getInventoryList();
    }

    this.setState({
      selectedSupplierType: this.props.selectedModalSupplierType,
    });
  }

  componentWillUnmount() {
    this.setState({
      supplierTypeOption: [],
      selectedSupplierType: undefined,
    });
  }

  componentDidUpdate() {
    let supplierType;
    let listKey;
    let supplierAttribute;
    let optionValueKey = 'id';
    if (this.props.attributeInfo.attributeType === 'SUPPLIER_TYPE') {
      supplierType = 'supplierType';
      listKey = 'supplierTypeList';
      supplierAttribute = 'supplier_attributes';
    } else if (this.props.attributeInfo.attributeType === 'BASE_SUPPLIER_TYPE') {
      supplierType = 'baseSupplierType';
      listKey = 'baseSupplierTypeList';
      supplierAttribute = 'supplier_attributes';
    } else if (this.props.attributeInfo.attributeType === 'INVENTORY_TYPE') {
      supplierType = 'baseInventory';
      listKey = 'baseInventoryList';
      supplierAttribute = 'base_attributes';
      optionValueKey = '_id';
    } else if (this.props.attributeInfo.attributeType === 'INVENTORY') {
      supplierType = 'baseInventory';
      listKey = 'inventoryList';
      supplierAttribute = 'inventory_attributes';
      optionValueKey = '_id';
    } else {
      // Unsupported attribute
    }

    if (this.state.supplierTypeOption.length !== this.props[supplierType][listKey].length) {
      let supplierTypeOption = [];
      this.props[supplierType][listKey].forEach((supplierType) => {
        supplierTypeOption.push({
          value: supplierType[optionValueKey],
          label: supplierType.name,
          attributes: supplierType[supplierAttribute].map((attribute) => {
            if (attribute.hasOwnProperty('isChecked')) {
              return attribute;
            }
            let checkedAttribute = Object.assign({}, attribute);
            checkedAttribute.isChecked = true;
            return checkedAttribute;
          }),
        });
      });
      this.setState({
        supplierTypeOption,
      });
    }
  }

  onSelectSupplierType(selectedSupplierType) {
    this.setState({
      selectedSupplierType,
    });
  }

  handleInputChange(event, option) {
    let { selectedSupplierType } = this.state;
    selectedSupplierType.attributes.forEach((attribute) => {
      if (attribute.name === option.name) {
        attribute.isChecked = event.target.checked;
      }
    });
    this.setState({
      selectedSupplierType,
    });
  }

  onSubmit() {
    let { selectedSupplierType } = this.state;

    this.props.onSubmit(selectedSupplierType, this.props.attributeInfo);
  }

  renderOptionRow(option, optionIndex) {
    return option.type !== 'SUPPLIER_TYPE' &&
      option.type !== 'BASE_SUPPLIER_TYPE' &&
      option.type !== 'INVENTORY_TYPE' &&
      option.type !== 'INVENTORY' ? (
      <div className="form-control option-container" key={optionIndex}>
        <input
          type="checkbox"
          className="input-checkbox"
          checked={option.isChecked}
          onChange={(event) => this.handleInputChange(event, option)}
          disabled={option.isRequired}
        />
        {option.name}
      </div>
    ) : (
      <div />
    );
  }

  render() {
    let { attributeInfo } = this.props;
    let { selectedSupplierType } = this.state;
    console.log('this.props: ', this.props);

    let supplierType;
    if (attributeInfo.attributeType === 'SUPPLIER_TYPE') {
      supplierType = 'Supplier Type';
    } else if (attributeInfo.attributeType === 'BASE_SUPPLIER_TYPE') {
      supplierType = 'Base Supplier Type';
    } else if (attributeInfo.attributeType === 'INVENTORY_TYPE') {
      supplierType = 'Base Inventory';
    } else if (attributeInfo.attributeType === 'INVENTORY') {
      supplierType = 'Inventory';
    }

    return (
      <Modal isOpen={this.props.showOptionModal} style={customStyles} ariaHideApp={false}>
        <div className="modal-title">
          <h3>Select Attributes for {supplierType}</h3>
        </div>
        <br />
        <div className="createform">
          <div className="createform__form">
            <div className="createform__form__inline">
              <div className="form-control">
                <label>*Select {supplierType}</label>
                <Select
                  options={this.state.supplierTypeOption}
                  value={this.state.selectedSupplierType}
                  onChange={this.onSelectSupplierType}
                />
              </div>
            </div>
            <div className="createform__form">
              {selectedSupplierType
                ? selectedSupplierType.attributes.map(this.renderOptionRow)
                : undefined}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn--danger"
                onClick={() => this.onSubmit(selectedSupplierType)}
              >
                Submit
              </button>{' '}
              <button type="button" className="btn btn--danger" onClick={this.props.onCancel}>
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
