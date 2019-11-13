import React from 'react';
import Select from 'react-select';
import { toastr } from 'react-redux-toastr';
import classnames from 'classnames';

import OptionModal from '../../Modals/OptionModal';
import SupplierSelectionModal from '../../Modals/SupplierSelectionModal';

const optionStyle = {
  fontSize: '12px',
  margin: '0',
  marginTop: '5px',
  textDecoration: 'underline',
  cursor: 'pointer',
  paddingBottom: '10px',
};

const AttributeTypes = [
  { value: 'STRING', label: 'Text' },
  { value: 'FLOAT', label: 'Float' },
  // { value: 'INVENTORY', label: 'Inventory' },
  // { value: 'INVENTORY_TYPE', label: 'Base Inventory' },
  { value: 'DROPDOWN', label: 'Dropdown' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'BASE_SUPPLIER_TYPE', label: 'Base Supplier Type' },
  { value: 'DATETIME', label: 'Date' },
];

// Get attribute type option from string
const getAttributeTypeOption = (value) => {
  for (let i = 0, l = AttributeTypes.length; i < l; i += 1) {
    if (AttributeTypes[i].value === value) {
      return AttributeTypes[i];
    }
  }

  return { value };
};

const validate = (data) => {
  const errors = {};

  if (!data.name.trim()) {
    errors.name = {
      message: 'Please enter a name for standard template',
    };
  }

  for (let i = 0; i < data.supplier_attributes.length; i++) {
    let attr = 'attribute' + i;
    let type = 'type' + i;
    if (!data.supplier_attributes[i].name) {
      errors[attr] = {
        message: 'This field should not be blank',
      };
    }
    if (!data.supplier_attributes[i].type) {
      errors[type] = {
        message: 'Please select the type',
      };
    }
    if (
      (data.supplier_attributes[i].type == 'DROPDOWN' ||
        data.supplier_attributes[i].type == 'HASHTAG' ||
        data.supplier_attributes[i].type == 'MULTISELECT') &&
      (!data.supplier_attributes[i].hasOwnProperty('options') ||
        data.supplier_attributes[i].options.length == 0 ||
        data.supplier_attributes[i].options.indexOf('') > -1)
    ) {
      let opt = 'options' + i;
      errors[opt] = {
        message: 'Please fill the options',
      };
    }
  }

  return errors;
};

export default class CreateBaseType extends React.Component {
  constructor() {
    super();

    this.state = {
      name: '',
      supplier_attributes: [{ name: '', type: '', is_required: false, is_editable: true }],
      showOptionModal: false,
      attributeOptions: [''],
      attributeInfo: {},
      selectedModalSupplierType: undefined,
      showSupplierSelectionModal: false,
      errors: {},
    };

    this.onAddAttribute = this.onAddAttribute.bind(this);
    this.onRemoveAttribute = this.onRemoveAttribute.bind(this);
    this.renderAttributeRow = this.renderAttributeRow.bind(this);
    this.handleAttributeChange = this.handleAttributeChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancelOptionModal = this.onCancelOptionModal.bind(this);
    this.onSubmitOptionModal = this.onSubmitOptionModal.bind(this);
    this.onOpenOptionModal = this.onOpenOptionModal.bind(this);
    this.onCancelSupplierModal = this.onCancelSupplierModal.bind(this);
    this.onSubmitSupplierModal = this.onSubmitSupplierModal.bind(this);
    this.onOpenSupplierModal = this.onOpenSupplierModal.bind(this);
    this.onBack = this.onBack.bind(this);
  }

  onCancelOptionModal() {
    this.setState({
      showOptionModal: false,
      attributeOptions: [''],
      attributeInfo: {},
    });
  }

  onSubmitOptionModal(options, attributeInfo) {
    this.setState({
      showOptionModal: false,
      attributeOptions: [''],
      attributeInfo: {},
    });

    let newAttributes = Object.assign({}, attributeInfo.attribute, {
      type: attributeInfo.attributeType,
      options: options,
    });
    this.handleAttributeChange(newAttributes, attributeInfo.attrIndex);
  }

  onOpenOptionModal(options, attributeType, attribute, attrIndex) {
    this.setState({
      showOptionModal: true,
      attributeOptions: options,
      attributeInfo: {
        attributeType,
        attribute,
        attrIndex,
      },
    });
  }

  onCancelSupplierModal() {
    this.setState({
      showSupplierSelectionModal: false,
      attributeInfo: {},
    });
  }

  onSubmitSupplierModal(value, attributeInfo) {
    this.setState({
      showSupplierSelectionModal: false,
      attributeInfo: {},
    });

    let newAttributes = Object.assign({}, attributeInfo.attribute, {
      type: attributeInfo.attributeType,
      value,
    });
    this.handleAttributeChange(newAttributes, attributeInfo.attrIndex);
  }

  onOpenSupplierModal(attributeType, attribute, attrIndex) {
    this.setState({
      showSupplierSelectionModal: true,
      selectedModalSupplierType: attribute.value,
      attributeInfo: {
        attributeType,
        attribute,
        attrIndex,
      },
    });
  }

  onBack() {
    const { match } = this.props;
    this.props.history.push(`/r/supplier/base-type/list`);
  }

  onSubmit(event) {
    event.preventDefault();

    let data = {
      name: this.state.name,
      supplier_attributes: this.state.supplier_attributes,
    };

    const errors = validate(data);

    if (Object.keys(errors).length) {
      this.setState({
        errors,
      });
    } else {
      this.props.postBaseSupplierType({ data }, () => {
        toastr.success('', 'Base Supplier Type created successfully');
        this.props.history.push('/r/supplier/base-type/list');
      });
    }
  }

  onAddAttribute() {
    const newAttributes = this.state.supplier_attributes.slice();

    newAttributes.push({
      name: '',
      type: 'STRING',
      is_required: false,
      is_editable: true,
    });

    this.setState({
      supplier_attributes: newAttributes,
    });
  }

  onRemoveAttribute(index) {
    const newAttributes = this.state.supplier_attributes.slice();
    newAttributes.splice(index, 1);
    this.setState({
      supplier_attributes: newAttributes,
    });
  }

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

  renderAttributeRow(attribute, attrIndex) {
    const { errors } = this.state;
    const onNameChange = (event) => {
      const newAttribute = Object.assign({}, attribute);

      newAttribute.name = event.target.value;

      this.handleAttributeChange(newAttribute, attrIndex);
    };

    const onTypeChange = (item) => {
      if (item.value === 'DROPDOWN') {
        this.setState({
          showOptionModal: true,
          columnOptions: [''],
          attributeInfo: {
            attributeType: item.value,
            attribute,
            attrIndex,
          },
        });
      } else if (
        item.value === 'BASE_SUPPLIER_TYPE' ||
        item.value === 'INVENTORY_TYPE' ||
        item.value === 'INVENTORY'
      ) {
        this.setState({
          showSupplierSelectionModal: true,
          attributeInfo: {
            attributeType: item.value,
            attribute,
            attrIndex,
          },
        });
        return;
      }
      const newAttribute = Object.assign({}, attribute);

      newAttribute.type = item.value;

      this.handleAttributeChange(newAttribute, attrIndex);
    };

    const onRequiredChange = (event) => {
      const newAttribute = {
        ...attribute,
        is_required: !!event.target.checked,
      };

      this.handleAttributeChange(newAttribute, attrIndex);
    };

    const onEditableChange = (event) => {
      const newAttribute = {
        ...attribute,
        is_editable: !!event.target.checked,
      };

      this.handleAttributeChange(newAttribute, attrIndex);
    };

    return (
      <div className="createform__form__row" key={`row-${attrIndex}`}>
        <div className="createform__form__inline">
          <div className="form-control form-control--column">
            <input
              type="text"
              placeholder="Name"
              value={attribute.name}
              onChange={onNameChange}
              className={classnames({ error: errors['attribute' + attrIndex] })}
            />
            {errors && errors['attribute' + attrIndex] ? (
              <p className="message message--error">{errors['attribute' + attrIndex].message}</p>
            ) : null}
          </div>

          <div className="form-control form-control--column">
            <Select
              options={AttributeTypes}
              classNamePrefix="form-select"
              value={getAttributeTypeOption(attribute.type)}
              onChange={onTypeChange}
            />
            {errors && errors['type' + attrIndex] ? (
              <p className="message message--error">{errors['type' + attrIndex].message}</p>
            ) : null}

            {attribute.type === 'DROPDOWN' ? (
              <p
                className="show-option"
                style={optionStyle}
                onClick={() =>
                  this.onOpenOptionModal(attribute.options, attribute.type, attribute, attrIndex)
                }
              >
                Show Options
              </p>
            ) : (
              ''
            )}
            {errors && errors['options' + attrIndex] ? (
              <p className="message message--error">{errors['options' + attrIndex].message}</p>
            ) : null}
            {attribute.type === 'BASE_SUPPLIER_TYPE' ||
            attribute.type === 'INVENTORY_TYPE' ||
            attribute.type === 'INVENTORY' ? (
              <p
                className="show-option"
                style={optionStyle}
                onClick={() => this.onOpenSupplierModal(attribute.type, attribute, attrIndex)}
              >
                Show Attributes
              </p>
            ) : (
              ''
            )}
          </div>
          <br />

          <div className="form-control required-field">
            <div>Is it required?</div>
            <input
              type="checkbox"
              className="input-checkbox"
              checked={attribute.is_required}
              onChange={onRequiredChange}
            />
          </div>
          <div className="form-control required-field">
            <div>Is it editable?</div>
            <input
              type="checkbox"
              className="input-checkbox"
              checked={attribute.is_editable}
              onChange={onEditableChange}
            />
          </div>
          <div className="createform__form__action">
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => this.onRemoveAttribute(attrIndex)}
            >
              Remove Attribute
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="createform">
        <div className="createform__title">
          <h3>Create Standard Template </h3>
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
                <label>*Enter Name For Base Supplier Type</label>
                <input
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleInputChange}
                />
                {errors.name ? (
                  <p className="message message--error">{errors.name.message}</p>
                ) : null}
              </div>
            </div>

            <div className="createform__form__header">Attributes</div>

            <div>{this.state.supplier_attributes.map(this.renderAttributeRow)}</div>

            <div className="createform__form__inline">
              <div className="createform__form__action">
                <button type="button" className="btn btn--danger" onClick={this.onAddAttribute}>
                  Add Attribute
                </button>
              </div>

              <div className="createform__form__action">
                <button type="submit" className="btn btn--danger">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
        <OptionModal
          key={this.state.attributeInfo.attrIndex}
          showOptionModal={this.state.showOptionModal}
          onCancel={this.onCancelOptionModal}
          onSubmit={this.onSubmitOptionModal}
          options={this.state.attributeOptions}
          columnInfo={this.state.attributeInfo}
        />
        {this.state.showSupplierSelectionModal ? (
          <SupplierSelectionModal
            {...this.props}
            showOptionModal={this.state.showSupplierSelectionModal}
            onCancel={this.onCancelSupplierModal}
            onSubmit={this.onSubmitSupplierModal}
            attributeInfo={this.state.attributeInfo}
            selectedModalSupplierType={this.state.selectedModalSupplierType}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
