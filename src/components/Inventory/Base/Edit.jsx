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
  { value: 'INVENTORY_TYPE', label: 'Inventory list' },
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
  console.log(data);

  if (!data.name.trim()) {
    errors.name = {
      message: 'Please enter a name for base booking',
    };
  }

  for (let i = 0; i < data.baseAttributes.length; i++) {
    let attr = 'attribute' + i;
    let type = 'type' + i;
    if (!data.baseAttributes[i].name) {
      errors[attr] = {
        message: 'This field should not be blank',
      };
    }

    if (!data.baseAttributes[i].type) {
      errors[type] = {
        message: 'Please select the type',
      };
    }

    if (
      (data.baseAttributes[i].type == 'DROPDOWN' ||
        data.baseAttributes[i].type == 'HASHTAG' ||
        data.baseAttributes[i].type == 'MULTISELECT') &&
      (!data.baseAttributes[i].hasOwnProperty('options') ||
        data.baseAttributes[i].options.length == 0 ||
        data.baseAttributes[i].options.indexOf('') > -1)
    ) {
      let opt = 'options' + i;
      errors[opt] = {
        message: 'Please fill the options',
      };
    }
  }

  return errors;
};

export default class Edit extends React.Component {
  constructor() {
    super();

    this.state = {
      name: '',
      baseAttributes: [],
      selectedBaseInventoryName: '',
      selectedBaseInventoryId: undefined,
      showOptionModal: false,
      attributeOptions: [''],
      attributeInfo: {},
      inventory_type: 'space_based',
      errors: {},
    };

    this.onAddAttribute = this.onAddAttribute.bind(this);
    this.renderAttributeRow = this.renderAttributeRow.bind(this);
    this.handleAttributeChange = this.handleAttributeChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancelOptionModal = this.onCancelOptionModal.bind(this);
    this.onSubmitOptionModal = this.onSubmitOptionModal.bind(this);
    this.onOpenOptionModal = this.onOpenOptionModal.bind(this);
    this.onBack = this.onBack.bind(this);
  }
  componentWillMount() {
    let baseInventoryId = this.props.match.params.baseInventoryId;
    this.props.getBaseInventoryById({ baseInventoryId: baseInventoryId });
  }

  componentDidUpdate(prevProps) {
    if (
      (!prevProps.baseInventory.baseAttributes.length &&
        this.props.baseInventory.baseAttributes.length) ||
      prevProps.baseInventory.baseInventoryId !== this.props.baseInventory.baseInventoryId
    ) {
      let baseAttributes = this.props.baseInventory.baseAttributes;
      this.setState({
        baseAttributes: baseAttributes,
        selectedBaseInventoryId: this.props.baseInventory.baseInventoryId,
        name: this.props.baseInventory.selectedBaseInventoryName,
      });
    }
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
    let baseInventoryId = this.props.match.params.baseInventoryId;

    const errors = validate(this.state);

    if (Object.keys(errors).length) {
      this.setState({
        errors,
      });
    } else {
      this.props.putBaseInventory({ data: this.state, baseInventoryId: baseInventoryId }, () => {
        toastr.success('', 'Base Inventory created successfully');
      });
    }
  }

  onBack() {
    const { match } = this.props;
    this.props.history.push(`/r/inventory/base/list`);
  }

  onAddAttribute() {
    const newAttributes = this.state.baseAttributes.slice();

    newAttributes.push({
      name: '',
      type: '',
      is_required: false,
    });

    this.setState({
      baseAttributes: newAttributes,
    });
  }

  handleAttributeChange(attribute, index) {
    const attributes = this.state.baseAttributes.slice();

    attributes.splice(index, 1, attribute);

    this.setState({
      baseAttributes: attributes,
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
              className={classnames({ error: errors['attribute' + attrIndex] })}
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
          <h3>Edit - Inventory Standard Template </h3>
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

            <div>{this.state.baseAttributes.map(this.renderAttributeRow)}</div>

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
