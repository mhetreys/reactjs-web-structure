import React from 'react';
import Modal from 'react-modal';
import { DatetimePickerTrigger } from 'rc-datetime-picker';
import moment from 'moment';

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

export default class PhaseModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      phases: [],
      phaseNumber: '',
      startDate: moment(),
      endDate: moment(),
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.renderPhaseRow = this.renderPhaseRow.bind(this);
    this.onPhaseAdd = this.onPhaseAdd.bind(this);
  }

  componentDidMount() {
    this.props.getPhaseList(this.props.campaign);
  }

  onPhaseAdd(event) {
    event.preventDefault();

    const { phase, postPhase, campaign } = this.props;
    const { phaseList } = phase;
    const { phaseNumber, startDate, endDate } = this.state;

    postPhase({
      data: [
        ...phaseList,
        {
          phase_no: phaseNumber,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        },
      ],
      ...campaign,
    });
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleStartDateChange(startDate) {
    this.setState({
      startDate,
    });
  }

  handleEndDateChange(endDate) {
    this.setState({
      endDate,
    });
  }

  handlePhaseRemove(phase) {
    const { deletePhase } = this.props;

    deletePhase({ ...phase });
  }

  renderPhaseRow(phase) {
    const onRemove = () => {
      this.handlePhaseRemove(phase);
    };

    return (
      <tr className="phase" key={phase.id}>
        <td>{phase.phase_no}</td>
        <td>{moment(phase.start_date).format('Do MMM, YYYY')}</td>
        <td>{moment(phase.end_date).format('Do MMM, YYYY')}</td>
        <td>
          <button type="button" className="btn btn--link" onClick={onRemove}>
            Remove
          </button>
        </td>
      </tr>
    );
  }

  render() {
    const { isVisible, onClose, phase } = this.props;
    const { phaseList } = phase;
    const { phaseNumber, startDate, endDate } = this.state;

    return (
      <Modal isOpen={isVisible} style={customStyles} ariaHideApp={false}>
        <div className="modal modal-comments">
          <div className="modal__header">
            <h3>Phases</h3>
          </div>
          <div className="modal__body">
            <div className="modal-comments__list">
              <table cellPadding="0" cellSpacing="0">
                <thead>
                  <tr>
                    <th>Phase</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {phaseList && phaseList.length ? (
                    phaseList.map(this.renderPhaseRow)
                  ) : (
                    <tr>
                      <td colSpan="5">No phases yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="modal-comments__add">
              <h5>Add phase</h5>
              <form onSubmit={this.onPhaseAdd}>
                <div className="form-control">
                  <input
                    type="text"
                    name="phaseNumber"
                    value={phaseNumber}
                    onChange={this.handleInputChange}
                  />
                </div>
                <div className="form-control">
                  <DatetimePickerTrigger moment={startDate} onChange={this.handleStartDateChange}>
                    <input type="text" value={startDate.format('YYYY-MM-DD')} readOnly />
                  </DatetimePickerTrigger>
                </div>
                <div className="form-control">
                  <DatetimePickerTrigger moment={endDate} onChange={this.handleEndDateChange}>
                    <input type="text" value={endDate.format('YYYY-MM-DD')} readOnly />
                  </DatetimePickerTrigger>
                </div>
                <div>
                  <button type="submit" className="btn btn--danger">
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="modal__footer">
            <button type="button" className="btn btn--danger" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}
