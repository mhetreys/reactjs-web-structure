import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ListBaseBooking extends Component {
  constructor() {
    super();

    this.state = {
      searchFilter: '',
    };

    this.onSearchFilterChange = this.onSearchFilterChange.bind(this);
    this.getFilteredList = this.getFilteredList.bind(this);
    this.renderBaseBookingRow = this.renderBaseBookingRow.bind(this);
  }

  componentDidMount() {
    this.props.getBaseBookingList();
  }

  onSearchFilterChange(event) {
    this.setState({
      searchFilter: event.target.value,
    });
  }

  getFilteredList(list) {
    return list.filter(
      (item) =>
        item.name
          .toLowerCase()
          .replace(/[^0-9a-z]/gi, '')
          .indexOf(this.state.searchFilter.toLowerCase().replace(/[^0-9a-z]/gi, '')) !== -1
    );
  }

  renderBaseBookingRow(baseBooking) {
    const onRemove = () => {
      this.props.deleteBaseBooking(baseBooking);
    };

    return (
      <tr key={baseBooking.id}>
        <td>{baseBooking.name}</td>
        <td>
          <Link to={`/r/booking/base/edit/${baseBooking.id}`} className="btn btn--danger">
            Edit
          </Link>
        </td>
        <td>
          <button type="button" className="btn btn--danger" onClick={onRemove}>
            Remove
          </button>
        </td>
      </tr>
    );
  }

  render() {
    const { searchFilter } = this.state;
    const { booking } = this.props;
    const { baseBookingList } = booking;
    const list = this.getFilteredList(baseBookingList);

    return (
      <div className="booking-base__list list">
        <div className="list__title">
          <h3>Bookings - Standard Template</h3>
        </div>

        <div className="list__filter">
          <input
            type="text"
            placeholder="Search..."
            value={searchFilter}
            onChange={this.onSearchFilterChange}
          />
        </div>

        <div className="list__table">
          <table cellPadding="0" cellSpacing="0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Action</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list && list.length ? (
                list.map(this.renderBaseBookingRow)
              ) : (
                <tr>
                  <td colSpan="5">No base bookings available. Create your first one now!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="list__actions">
          <Link to="/r/booking/base/create" className="btn btn--danger">
            Create
          </Link>
        </div>
      </div>
    );
  }
}
