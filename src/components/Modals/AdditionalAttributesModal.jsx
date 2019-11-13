import React from 'react';
import Modal from 'react-modal';
import Select from 'react-select';

import '../Checklist/index.css';
import './index.css';
import GoogleMap from '../GoogleMap';

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

export default class AdditionalAttributeModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      additional_attributes: this.props.attributes || [],
      latitude: undefined,
      longitude: undefined,
      // states: this.props.states
    };
  }

  componentDidMount() {
    if (this.state.additional_attributes.length) {
      this.state.additional_attributes.forEach((attribute) => {
        if (attribute.name === 'Latitude') {
          this.setState({
            latitude: attribute.value,
          });
        }
        if (attribute.name === 'Longitude') {
          this.setState({
            longitude: attribute.value,
          });
        }
      });
    }
  }
  handleAttributeChange = (attribute, index) => {
    const { additional_attributes } = this.state;

    additional_attributes[index] = { ...attribute };
    this.setState({
      additional_attributes,
    });
  };

  onSubmit = () => {
    const { additional_attributes, pricing } = this.state;
    const { attributes, onChange, onClose, isDisabled } = this.props;
    const newAttributes = additional_attributes;

    onChange(newAttributes);

    // Close modal on submit
    onClose();
  };

  renderAttributeRow = (attribute, index) => {
    if (attribute.isChecked === false) {
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

      switch (newAttribute.name) {
        case 'State':
          this.props.getCities({ id: newValue.id });
          break;
        case 'City':
          this.props.getAreas({ id: newValue.id });
          break;
        case 'Area':
          this.props.getSubAreas({ id: newValue.id });
          break;
        default:
          break;
      }

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
            disabled={this.props.isDisabled}
          />
        );
      case 'STRING':
        return (
          <input
            type="text"
            placeholder="Attribute Value"
            value={attribute.value}
            onChange={onValueChange}
            disabled={this.props.isDisabled}
          />
        );
      case 'EMAIL':
        return (
          <input
            type="email"
            placeholder="Attribute Value"
            value={attribute.value}
            onChange={onValueChange}
            disabled={this.props.isDisabled}
          />
        );
      case 'DROPDOWN':
        let attributeValueOptions = [];
        if (attribute.name == 'State') {
          attribute.options.forEach((option) => {
            attributeValueOptions.push({
              label: option.state_name,
              value: option.state_name,
              id: option.id,
            });
          });
        } else if (attribute.name == 'City') {
          attribute.options.forEach((option) => {
            attributeValueOptions.push({
              label: option.city_name,
              value: option.city_name,
              id: option.id,
            });
          });
        } else if (attribute.name == 'Area') {
          attribute.options.forEach((option) => {
            attributeValueOptions.push({
              label: option.label,
              value: option.label,
              id: option.id,
            });
          });
        } else if (attribute.name == 'Sub Area') {
          attribute.options.forEach((option) => {
            attributeValueOptions.push({
              label: option.subarea_name,
              value: option.subarea_name,
              id: option.id,
            });
          });
        } else {
          attribute.options.forEach((option) => {
            attributeValueOptions.push({ label: option, value: option });
          });
        }

        return (
          <Select
            styles={customSelectStyles}
            options={attributeValueOptions}
            value={{ label: attribute.value, value: attribute.value }}
            onChange={onDropDownAttributeValueChange}
            disabled={this.props.isDisabled}
          />
        );
      default:
        return;
    }
  };

  render() {
    const { isVisible, attributes, onClose, attribute, locationData } = this.props;
    const { latitude, longitude } = this.state;

    if (attributes.length && attribute === 'location_details') {
      if (locationData.states.length) {
        attributes[5].options = [];
        locationData.states.forEach((item) => {
          attributes[5].options.push(item);
        });
      }
      if (locationData.cities.length) {
        attributes[4].options = [];
        locationData.cities.forEach((item) => {
          attributes[4].options.push(item);
        });
      }

      if (locationData.areas.length) {
        attributes[2].options = [];
        locationData.areas.forEach((item) => {
          attributes[2].options.push(item);
        });
      }
      if (locationData.subareas.length) {
        attributes[3].options = [];
        locationData.subareas.forEach((item) => {
          attributes[3].options.push(item);
        });
      }
    }

    return (
      <Modal isOpen={isVisible} style={customStyles} ariaHideApp={false}>
        <div className="modal-title">
          <h3>Fill Additional Attributes</h3>
        </div>
        {latitude && longitude ? (
          <div>
            <GoogleMap latitude={latitude} longitude={longitude} />
          </div>
        ) : null}
        <div className="createform__form">
          {attributes.length ? attributes.map(this.renderAttributeRow) : null}
        </div>
        <div className="modal-footer">
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
