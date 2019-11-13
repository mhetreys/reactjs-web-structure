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

const DaysOptions = [...Array(30)].map((a, b) => ({
  label: b + 1,
  value: b + 1,
}));

export default class InventoryPricingDisplayModal extends React.Component {
  constructor(props) {
    super(props);

    const { inventory } = this.props;

    let pricing = {
      days: null,
      price: '',
    };

    if (inventory.negotiated_pricing && inventory.negotiated_pricing) {
      pricing = inventory.negotiated_pricing;
    }

    this.state = {
      pricing,
    };
  }

  onSubmit = () => {
    const { pricing } = this.state;
    const { inventory, onChange, onClose } = this.props;

    onChange(inventory, pricing);

    // Close modal on submit
    onClose();
  };

  renderPricingRow = (row) => {
    return (
      <tr key={row.days}>
        <td>{row.days}</td>
        <td>{row.price}</td>
      </tr>
    );
  };

  renderPricingAdd = () => {
    let { pricing } = this.state;

    const onDaysChange = (day) => {
      pricing = {
        ...pricing,
        days: day.value,
      };
      this.setState({
        pricing,
      });
    };

    const onPriceChange = (event) => {
      pricing = {
        ...pricing,
        price: event.target.value,
      };
      this.setState({
        pricing,
      });
    };

    return (
      <div className="createform__form__inline supplier-modal-input">
        <div className="form-control">
          <Select
            options={DaysOptions}
            value={DaysOptions.filter(({ value }) => value === pricing.days)}
            onChange={onDaysChange}
            classNamePrefix="form-select"
          />
        </div>
        <div className="form-control">
          <input type="number" placeholder="Price" value={pricing.price} onChange={onPriceChange} />
        </div>
      </div>
    );
  };

  render() {
    const { inventory, isVisible, onClose } = this.props;

    return (
      <Modal isOpen={isVisible} style={customStyles} ariaHideApp={false}>
        <div className="modal modal-pricing-display">
          <div className="modal__header">
            <h3>Set Negotiated Pricing for {inventory.name}</h3>
          </div>
        </div>
        <div className="modal__body">
          <div className="modal-pricing-display__list">
            <table>
              <thead>
                <tr>
                  <th>Days</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>{inventory.pricing && inventory.pricing.map(this.renderPricingRow)}</tbody>
            </table>
          </div>

          <div className="title">Enter Pricing Details</div>
          {this.renderPricingAdd()}
        </div>
        <div className="modal__footer">
          <button type="button" className="btn btn--danger" onClick={this.onSubmit}>
            Submit
          </button>{' '}
          <button type="button" className="btn btn--danger" onClick={onClose}>
            Close
          </button>
        </div>
      </Modal>
    );
  }
}
