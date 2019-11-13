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

export default class FillSupplierModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSupplierType: undefined,
      pricingRows: [
        {
          days: null,
          price: null,
        },
      ],
    };
    this.renderAttributeRow = this.renderAttributeRow.bind(this);
    this.renderPricingRow = this.renderPricingRow.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSelectSupplierType = this.onSelectSupplierType.bind(this);
    this.handleAttributeChange = this.handleAttributeChange.bind(this);
    this.renderInputField = this.renderInputField.bind(this);
    this.onAddPricingClick = this.onAddPricingClick.bind(this);
  }

  componentWillMount() {
    this.setState({
      selectedSupplierType: this.props.selectedSupplierType,
    });
  }

  componentWillUnmount() {
    this.setState({
      selectedSupplierType: undefined,
    });
  }

  onSelectSupplierType(selectedSupplierType) {
    this.setState({
      selectedSupplierType,
    });
  }

  onAddPricingClick() {
    const { pricingRows } = this.state;

    pricingRows.push({});

    this.setState({
      pricingRows,
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
    const { selectedSupplierType, pricingRows } = this.state;

    this.props.onSubmit(
      selectedSupplierType,
      this.props.columnInfo,
      pricingRows.map((item) => ({ ...item, days: item.days.value }))
    );
  }

  renderAttributeRow(attribute, attrIndex) {
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
      <div className="createform__form__row" key={`row-${attrIndex}`}>
        <div className="createform__form__inline supplier-modal-input">
          <div className="form-control">
            <input type="text" value={attribute.name} disabled />
          </div>

          <div className="form-control">{this.renderInputField(attribute, attrIndex)}</div>
        </div>
      </div>
    );
  }

  renderPricingRow(row, index) {
    const onDaysChange = (day) => {
      const { pricingRows } = this.state;

      pricingRows[index] = {
        ...pricingRows[index],
        days: day,
      };
      this.setState({
        pricingRows,
      });
    };

    const onPriceChange = (event) => {
      const { pricingRows } = this.state;

      pricingRows[index] = {
        ...pricingRows[index],
        price: event.target.value,
      };
      this.setState({
        pricingRows,
      });
    };

    const onCancel = () => {
      const { pricingRows } = this.state;
      pricingRows.splice(index, 1);
      this.setState({
        pricingRows,
      });
    };

    return (
      <div className="createform__form__inline supplier-modal-input" key={index}>
        <div className="form-control">
          <Select
            options={DaysOptions}
            value={row.days}
            onChange={onDaysChange}
            classNamePrefix="form-select"
          />
        </div>
        <div className="form-control">
          <input type="number" placeholder="Price" value={row.price} onChange={onPriceChange} />
        </div>
        {''}
        {this.state.pricingRows.length > 1 ? (
          <button type="button" className="btn btn--link" onClick={onCancel}>
            X
          </button>
        ) : null}
      </div>
    );
  }

  handleAttributeChange(attribute, index) {
    const selectedSupplierType = Object.assign({}, this.state.selectedSupplierType);

    selectedSupplierType.attributes.splice(index, 1, attribute);

    this.setState({
      selectedSupplierType,
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
            styles={customSelectStyles}
            options={attributeValueOptions}
            value={{ label: attribute.value, value: attribute.value }}
            onChange={onDropDownAttributeValueChange}
          />
        );
      default:
        return;
    }
  }

  render() {
    let { columnInfo } = this.props;
    let { selectedSupplierType, pricingRows } = this.state;

    let supplierTypeText;
    if (columnInfo.attribute.type === 'SUPPLIER_TYPE') {
      supplierTypeText = 'Supplier Type';
    } else if (columnInfo.attribute.type === 'BASE_SUPPLIER_TYPE') {
      supplierTypeText = 'Base Supplier Type';
    } else {
      supplierTypeText = 'Base Inventory';
    }

    return (
      <Modal isOpen={this.props.showOptionModal} style={customStyles} ariaHideApp={false}>
        <div className="modal-title">
          <h3>
            Fill Attributes for{' '}
            {selectedSupplierType.type === 'SUPPLIER_TYPE'
              ? 'Supplier Type'
              : ' Base Supplier Type'}
          </h3>
        </div>
        <br />
        <div className="">
          <div className="createform">
            <div className="createform__form">
              <div className="title">
                {supplierTypeText + ': ' + this.state.selectedSupplierType.label}
              </div>
            </div>
            <div className="createform__form">
              {selectedSupplierType
                ? selectedSupplierType.attributes.map(this.renderAttributeRow)
                : undefined}
            </div>
            <div className="createform__form">
              <div className="title">Add Pricing Details</div>
              {pricingRows.map(this.renderPricingRow)}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn--danger" onClick={this.onAddPricingClick}>
                Add Pricing
              </button>{' '}
              <button
                type="button"
                className="btn btn--danger"
                onClick={() => this.onSubmit(selectedSupplierType, columnInfo)}
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
