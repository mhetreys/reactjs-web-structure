import React from 'react';
import Select from 'react-select';
import { toastr } from 'react-redux-toastr';
import classnames from 'classnames';

import OptionModal from './../../Modals/OptionModal';

const optionStyle = {
  fontSize: '12px',
  margin: '0',
  marginTop: '5px',
  textDecoration: 'underline',
  cursor: 'pointer',
};

const AttributeTypes = [
  { value: 'FLOAT', label: 'Float' },
  { value: 'STRING', label: 'Text' },
  { value: 'DROPDOWN', label: 'Dropdown' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'MULTISELECT', label: 'Multi Select' },
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
      message: 'Please enter a name for base booking',
    };
  }

  for (let i = 0; i < data.base_attributes.length; i++) {
    let attr = 'attribute' + i;
    let type = 'type' + i;
    if (!data.base_attributes[i].name) {
      errors[attr] = {
        message: 'This field should not be blank',
      };
    }

    if (!data.base_attributes[i].type) {
      errors[type] = {
        message: 'Please select the type',
      };
    }

    if (
      (data.base_attributes[i].type == 'DROPDOWN' ||
        data.base_attributes[i].type == 'HASHTAG' ||
        data.base_attributes[i].type == 'MULTISELECT') &&
      (!data.base_attributes[i].hasOwnProperty('options') ||
        data.base_attributes[i].options.length == 0 ||
        data.base_attributes[i].options.indexOf('') > -1)
    ) {
      let opt = 'options' + i;
      errors[opt] = {
        message: 'Please fill the options',
      };
    }
  }

  return errors;
};

export default class CreateType extends React.Component {
  constructor() {
    super();

    this.state = {
      name: '',
      base_attributes: [{ name: '', type: '', is_required: false }],
      showOptionModal: false,
      attributeOptions: [''],
      attributeInfo: {},
      inventory_type: 'space_based',
      isDisabled: false,
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

  onSubmit(event) {
    event.preventDefault();
    const isDisabled = this.state.isDisabled;
    let value = isDisabled;
    this.setState({
      isDisabled: !value,
    });

    const errors = validate(this.state);

    if (Object.keys(errors).length) {
      this.setState({
        errors,
      });
    } else {
      this.props.postBaseInventory({ data: this.state }, () => {
        this.setState({
          isDisabled: value,
        });
        toastr.success('', 'Base Inventory created successfully');
        this.props.history.push(`/r/inventory/base/list`);
      });
    }
  }

  onAddAttribute() {
    const newAttributes = this.state.base_attributes.slice();

    newAttributes.push({
      name: '',
      type: '',
      is_required: false,
    });

    this.setState({
      base_attributes: newAttributes,
    });
  }

  onRemoveAttribute(index) {
    const newAttributes = this.state.base_attributes.slice();
    newAttributes.splice(index, 1);
    this.setState({
      base_attributes: newAttributes,
    });
  }

  handleAttributeChange(attribute, index) {
    const attributes = this.state.base_attributes.slice();

    attributes.splice(index, 1, attribute);

    this.setState({
      base_attributes: attributes,
    });
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  onBack() {
    const { match } = this.props;
    this.props.history.push(`/r/inventory/base/list`);
  }

  renderAttributeRow(attribute, attrIndex) {
    const { errors } = this.state;
    const onNameChange = (event) => {
      const newAttribute = Object.assign({}, attribute);

      newAttribute.name = event.target.value;

      this.handleAttributeChange(newAttribute, attrIndex);
    };

    const onTypeChange = (item) => {
      if (item.value === 'DROPDOWN' || item.value === 'MULTISELECT') {
        this.setState({
          showOptionModal: true,
          columnOptions: [''],
          attributeInfo: {
            attributeType: item.value,
            attribute,
            attrIndex,
          },
        });
      }
      const newAttribute = Object.assign({}, attribute);

      newAttribute.type = item.value;

      this.handleAttributeChange(newAttribute, attrIndex);
    };

    const onRequiredChange = (event) => {
      const newAttribute = Object.assign({}, attribute);

      newAttribute.is_required = !!event.target.checked;

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
            {attribute.type === 'DROPDOWN' || attribute.type === 'MULTISELECT' ? (
              <p
                className="show-option"
                style={optionStyle}
                onClick={() =>
                  this.onOpenOptionModal(
                    attribute.options,
                    attribute.type,
                    attribute,
                    attribute.attrIndex
                  )
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
            {errors && errors['type' + attrIndex] ? (
              <p className="message message--error">{errors['type' + attrIndex].message}</p>
            ) : null}
          </div>

          <div className="form-control required-field">
            <div>Is it required?</div>
            <input
              type="checkbox"
              className="input-checkbox"
              value={attribute.is_required}
              onChange={onRequiredChange}
            />
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
    const { isDisabled, errors } = this.state;
    return (
      <div className="createform">
        <div className="createform__title">
          <h3>Create - Inventory Standard Template</h3>
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
                <label>*Enter Name For Base Inventory</label>
                <input
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleInputChange}
                  className={classnames({ error: errors.name })}
                />
                {errors && errors.name ? (
                  <p className="message message--error">{errors.name.message}</p>
                ) : null}
              </div>
            </div>

            <div className="createform__form__header">Attributes</div>

            <div>{this.state.base_attributes.map(this.renderAttributeRow)}</div>

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
      </div>
    );
  }
}
