import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ListBookingTemplate extends Component {
  constructor() {
    super();

    this.state = {
      searchFilter: '',
    };

    this.onSearchFilterChange = this.onSearchFilterChange.bind(this);
    this.getFilteredList = this.getFilteredList.bind(this);
    this.renderBookingTemplateRow = this.renderBookingTemplateRow.bind(this);
  }

  componentDidMount() {
    this.props.getBookingTemplateList();
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

  renderBookingTemplateRow(bookingTemplate) {
    const onRemove = () => {
      this.props.deleteBookingTemplate(bookingTemplate);
    };

    return (
      <tr key={bookingTemplate.id}>
        <td>{bookingTemplate.name}</td>
        <td>
          <Link to={`/r/booking/template/edit/${bookingTemplate.id}`} className="btn btn--danger">
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
    const { bookingTemplateList } = booking;
    const list = this.getFilteredList(bookingTemplateList);

    return (
      <div className="booking-template__list list">
        <div className="list__title">
          <h3>Bookings - Templates</h3>
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
                list.map(this.renderBookingTemplateRow)
              ) : (
                <tr>
                  <td colSpan="5">No booking templates available. Create your first one now!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="list__actions">
          <Link to="/r/booking/template/create" className="btn btn--danger">
            Create
          </Link>
        </div>
      </div>
    );
  }
}
