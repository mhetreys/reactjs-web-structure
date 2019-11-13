import React from 'react';
import Modal from 'react-modal';

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
  },
};

export default class OptionModal extends React.Component {
  constructor(props) {
    super(props);

    let options = [''];
    if (props.options) {
      options = props.options;
    }
    this.state = {
      options: options,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.renderOptionRow = this.renderOptionRow.bind(this);
    this.addOptionRow = this.addOptionRow.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.options && prevProps.options && prevProps.options[0] !== this.props.options[0]) {
      this.setState({
        options: this.props.options,
      });
    }
  }

  addOptionRow() {
    let newOptions = this.state.options;

    newOptions.push('');

    this.setState({
      options: newOptions,
    });
  }

  handleInputChange(option, index) {
    const options = [...this.state.options];

    options.splice(index, 1, option);

    this.setState({
      options: options,
    });
  }

  handleOptionRemove(index) {
    const options = [...this.state.options];

    options.splice(index, 1);

    if (!options.length) {
      options.push('');
    }

    this.setState({
      options,
    });
  }

  renderOptionRow(option, optionIndex) {
    const onOptionChange = (event) => {
      let newOption = event.target.value;

      this.handleInputChange(newOption, optionIndex);
    };

    const onRemove = () => {
      this.handleOptionRemove(optionIndex);
    };

    return (
      <div className="form-control option" key={optionIndex}>
        <input
          type="text"
          className="input-option"
          value={option}
          placeholder="Enter Option"
          onChange={onOptionChange}
        />
        <div className="option__actions">
          <button type="button" className="btn btn--link" onClick={onRemove}>
            Remove
          </button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Modal isOpen={this.props.showOptionModal} style={customStyles} ariaHideApp={false}>
        <div className="modal modal-options">
          <div className="modal__header">
            <h3>Add Options</h3>
          </div>
          <div className="modal__body">{this.state.options.map(this.renderOptionRow)}</div>
          <div className="modal__footer">
            <button type="button" className="btn btn--danger" onClick={this.addOptionRow}>
              Add Option
            </button>
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => this.props.onSubmit(this.state.options, this.props.columnInfo)}
            >
              Submit
            </button>
            <button type="button" className="btn btn--danger" onClick={this.props.onCancel}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}
