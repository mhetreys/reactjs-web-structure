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

const customSelectStyles = {
  input: () => ({
    height: '24px',
  }),
};

const DaysOptions = [...Array(30)].map((a, b) => ({
  label: b + 1,
  value: b + 1,
}));

export default class FillInventoryModal extends React.Component {
  constructor(props) {
    super(props);

    const { inventory } = this.props;

    let pricing = [
      {
        days: null,
        price: '',
      },
    ];

    if (inventory.pricing && inventory.pricing.length) {
      pricing = inventory.pricing;
    }

    this.state = {
      attributes: inventory.inventory_attributes || [],
      pricing,
    };
  }

  onAddPricingClick = () => {
    const { pricing } = this.state;

    pricing.push({});

    this.setState({
      pricing,
    });
  };

  onSubmit = () => {
    const { attributes, pricing } = this.state;
    const { inventory, onChange, onClose } = this.props;

    const newInventory = Object.assign({}, inventory, {
      inventory_attributes: attributes,
      pricing: pricing.filter((item) => item.days),
    });

    onChange(newInventory);

    // Close modal on submit
    onClose();
  };

  handleAttributeChange = (attribute, index) => {
    const { attributes } = this.state;

    attributes[index] = { ...attribute };

    this.setState({
      attributes,
    });
  };

  renderAttributeRow = (attribute, index) => {
    if (attribute.isChecked === false) {
      return;
    }

    if (
      attribute.type === 'SUPPLIER_TYPE' ||
      attribute.type === 'BASE_SUPPLIER_TYPE' ||
      attribute.type === 'INVENTORY_TYPE'
    ) {
      return;
    }

    return (
      <div className="createform__form__row" key={attribute.name}>
        <div className="createform__form__inline supplier-modal-input">
          <div className="form-control">
            <input type="text" value={attribute.name} disabled />
          </div>

          <div className="form-control">{this.renderAttributeInput(attribute, index)}</div>
        </div>
      </div>
    );
  };

  renderPricingRow = (row, index) => {
    const { pricing } = this.state;

    const onDaysChange = (day) => {
      pricing[index] = {
        ...pricing[index],
        days: day.value,
      };
      this.setState({
        pricing,
      });
    };

    const onPriceChange = (event) => {
      pricing[index] = {
        ...pricing[index],
        price: event.target.value,
      };
      this.setState({
        pricing,
      });
    };

    const onRemove = () => {
      pricing.splice(index, 1);

      this.setState({
        pricing,
      });
    };

    return (
      <div className="createform__form__inline supplier-modal-input" key={index}>
        <div className="form-control">
          <Select
            options={DaysOptions}
            value={DaysOptions.filter(({ value }) => value === row.days)}
            onChange={onDaysChange}
            classNamePrefix="form-select"
          />
        </div>
        <div className="form-control">
          <input type="number" placeholder="Price" value={row.price} onChange={onPriceChange} />
        </div>
        {''}
        {pricing.length > 1 ? (
          <button type="button" className="btn btn--link" onClick={onRemove}>
            &times;
          </button>
        ) : null}
      </div>
    );
  };

  renderAttributeInput = (attribute, attrIndex) => {
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
            styles={customSelectStyles}
            options={attributeValueOptions}
            value={{ label: attribute.value, value: attribute.value }}
            onChange={onDropDownAttributeValueChange}
          />
        );
      default:
        return;
    }
  };

  render() {
    const { attributes, pricing } = this.state;
    const { inventory, isVisible, onClose } = this.props;

    return (
      <Modal isOpen={isVisible} style={customStyles} ariaHideApp={false}>
        <div className="modal-title">
          <h3>Fill Attributes for Inventory</h3>
        </div>
        <br />
        <div className="">
          <div className="createform">
            <div className="createform__form">
              <div className="title">Inventory: {inventory.name}</div>
            </div>
            <div className="createform__form">{attributes.map(this.renderAttributeRow)}</div>
            <div className="createform__form">
              <div className="title">Add Pricing Details</div>
              {pricing.map(this.renderPricingRow)}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn--danger" onClick={this.onAddPricingClick}>
                Add Pricing
              </button>{' '}
              <button type="button" className="btn btn--danger" onClick={this.onSubmit}>
                Submit
              </button>{' '}
              <button type="button" className="btn btn--danger" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
