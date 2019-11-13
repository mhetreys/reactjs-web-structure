import React from 'react';
import Select from 'react-select';
import { toastr } from 'react-redux-toastr';

import OptionModal from '../Modals/OptionModal';

const optionStyle = {
  fontSize: '12px',
  marginBottom: '-24px',
  textDecoration: 'underline',
  cursor: 'pointer',
  paddingBottom: '10px',
};

const AttributeTypes = [
  { value: 'STRING', label: 'Text' },
  { value: 'INT', label: 'Int' },
  { value: 'FLOAT', label: 'Float' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'DROPDOWN', label: 'Dropdown' },
  { value: 'CHECKBOX', label: 'Checkbox' },
  { value: 'RADIO', label: 'Radio' },
  { value: 'TEXTAREA', label: 'Textarea' },
  { value: 'DATE', label: 'Date' },
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

export default class EditLeadForm extends React.Component {
  constructor() {
    super();

    this.state = {
      name: '',
      leads_form_items: [],
      leads_form_id: '',
      showOptionModal: false,
      attributeOptions: [''],
      attributeInfo: {},
    };

    this.onAddAttribute = this.onAddAttribute.bind(this);
    this.renderAttributeRow = this.renderAttributeRow.bind(this);
    this.handleAttributeChange = this.handleAttributeChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancelOptionModal = this.onCancelOptionModal.bind(this);
    this.onSubmitOptionModal = this.onSubmitOptionModal.bind(this);
    this.onOpenOptionModal = this.onOpenOptionModal.bind(this);
  }

  componentWillMount() {
    this.props.getLeadForm(this.props.match.params.leadFormId);
  }

  componentDidUpdate() {
    if (
      Object.keys(this.props.leads.leadForm).length != 0 &&
      this.state.leads_form_items.length == 0
    ) {
      let leads_form_items = this.props.leads.leadForm.leads_form_items;

      let result = Object.keys(leads_form_items).map(function(key) {
        return leads_form_items[key];
      });

      this.setState({
        leads_form_items: result,
        name: this.props.leads.leadForm.leads_form_name,
        leads_form_id: this.props.leads.leadForm.leads_form_id,
      });
    }

    const { match } = this.props;
    this.campaignId = match.params.campaignId;
    console.log(this.campaignId);
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
      key_type: attributeInfo.attributeType,
      key_options: options,
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

    let data = {
      name: this.state.name,
      leads_form_id: this.state.leads_form_id,
      leads_form_items: this.state.leads_form_items,
    };

    this.props.updateLeadForm(
      {
        data,
        leadFormId: data.leads_form_id,
      },
      () => {
        toastr.success('', 'Lead Form updated successfully');
        this.props.history.push(`/r/leads/${this.props.match.params.campaignId}/form`);
      }
    );
  }

  onAddAttribute() {
    const newAttributes = this.state.leads_form_items.slice();

    newAttributes.push({
      key_name: '',
      key_type: '',
      is_required: false,
      order_id: newAttributes.lenght + 1,
    });

    this.setState({
      leads_form_items: newAttributes,
    });
  }

  handleAttributeChange(attribute, index) {
    const attributes = this.state.leads_form_items.slice();

    attributes.splice(index, 1, attribute);
    this.setState({
      leads_form_items: attributes,
    });
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  renderAttributeRow(attribute, attrIndex) {
    const onNameChange = (event) => {
      const newAttribute = Object.assign({}, attribute);

      newAttribute.key_name = event.target.value;

      this.handleAttributeChange(newAttribute, attrIndex);
    };

    const onTypeChange = (item) => {
      if (item.value === 'DROPDOWN' || item.value === 'CHECKBOX' || item.value === 'RADIO') {
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

      newAttribute.key_type = item.value;

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
          <div className="form-control">
            <input
              type="text"
              placeholder="Name"
              value={attribute.key_name}
              onChange={onNameChange}
            />
          </div>

          <div className="form-control">
            <Select
              options={AttributeTypes}
              classNamePrefix="form-select"
              value={getAttributeTypeOption(attribute.key_type)}
              onChange={onTypeChange}
            />

            {attribute.key_type === 'DROPDOWN' ||
            attribute.key_type === 'CHECKBOX' ||
            attribute.key_type === 'RADIO' ? (
              <p
                className="show-option"
                style={optionStyle}
                onClick={() =>
                  this.onOpenOptionModal(
                    attribute.key_options,
                    attribute.key_type,
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
    return (
      <div className="createform">
        <div className="createform__title">
          <h3>Edit Lead Form </h3>
        </div>
        <div className="createform__form">
          <form onSubmit={this.onSubmit}>
            <div className="createform__form__inline">
              <div className="form-control">
                <label>*Enter Name For Lead Form</label>
                <input
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>

            <div className="createform__form__header">Attributes</div>

            <div>{this.state.leads_form_items.map(this.renderAttributeRow)}</div>

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
