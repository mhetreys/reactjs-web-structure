import React from 'react';
import { Link } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';
import PropTypes from 'prop-types';
import Select from 'react-select';
import DatetimeRangePicker from 'react-datetime-range-picker';
import ReactPaginate from 'react-paginate';

const DateTypes = [
  { label: 'Created At', value: 'created_at' },
  { label: 'Updated At', value: 'updated_at' },
  { label: 'None', value: undefined },
];
export default class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchFilter: '',
      isDateRangePickerVisisble: false,
      startDate: '',
      endDate: '',
      selectedDateFilter: '',
      offset: 0,
      perPage: 10,
    };

    this.onSearchFilterChange = this.onSearchFilterChange.bind(this);
    this.getFilteredList = this.getFilteredList.bind(this);
    this.renderSupplierRow = this.renderSupplierRow.bind(this);
    this.onDateFilterChange = this.onDateFilterChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  componentWillMount() {
    this.props.getSupplierList();
  }

  onSearchFilterChange(event) {
    this.setState({
      searchFilter: event.target.value,
    });
  }

  getFilteredList(list) {
    let result = list.filter(
      (item) =>
        item.name
          .toLowerCase()
          .replace(/[^0-9a-z]/gi, '')
          .indexOf(this.state.searchFilter.toLowerCase().replace(/[^0-9a-z]/gi, '')) !== -1
    );

    if (this.state.startDate && this.state.endDate) {
      result = result.filter((item) => {
        return (
          new Date(item[this.state.selectedDateFilter]) >= this.state.startDate &&
          new Date(item[this.state.selectedDateFilter]) <= this.state.endDate
        );
      });
      return result;
    } else {
      return result;
    }
  }

  renderSupplierRow(supplier, index) {
    const onRemove = () => {
      this.props.deleteSupplier(supplier.id, () => {
        toastr.error('', 'Supplier deleted successfully');
      });
    };

    return (
      <tr key={supplier.id}>
        <td>{index + 1}</td>
        <td>{supplier.name}</td>
        <td>
          <button type="button" className="btn btn--danger" onClick={onRemove}>
            Remove
          </button>
        </td>
        <td>
          <Link to={`/r/supplier/edit/${supplier.id}`} className="btn btn--danger">
            Edit Supplier
          </Link>
        </td>
      </tr>
    );
  }

  onDateFilterChange(option) {
    if (option.value) {
      this.setState({
        isDateRangePickerVisisble: true,
        selectedDateFilter: option.value,
      });
    } else {
      this.setState({
        isDateRangePickerVisisble: false,
        selectedDateFilter: option.value,
        startDate: undefined,
        endDate: undefined,
      });
    }
  }

  handleDateChange(date) {
    this.setState({
      startDate: date.start,
      endDate: date.end,
    });
  }

  handlePageClick = (data) => {
    console.log(data);

    const selectedPage = data.selected;
    const offset = selectedPage * this.state.perPage;
    this.setState({
      offset,
    });
  };

  render() {
    const { searchFilter, isDateRangePickerVisisble } = this.state;
    const { supplierList } = this.props.supplier;
    // const supplierListByDate = this.getFilteredListByDateRange(supplierList);
    const list = this.getFilteredList(supplierList);
    let elements = list.slice(this.state.offset, this.state.offset + this.state.perPage);

    return (
      <div className="supplier-list">
        <div className="list">
          <div className="list__title">
            <h3>Supplier List</h3>
          </div>
          <div className="manage-image__filters">
            <div className="form-control">
              <Select
                className="select"
                options={DateTypes}
                // getOptionValue={(option) => option.id}
                // getOptionLabel={(option) => option.name}
                // value={supplierById[selectedSupplierId]}
                defaultValue={{ label: 'None', value: undefined }}
                onChange={this.onDateFilterChange}
                placeholder="Filter By Date"
              />
            </div>

            {isDateRangePickerVisisble ? (
              <div className="form-control">
                <DatetimeRangePicker className="dateTimePicker" onChange={this.handleDateChange} />
              </div>
            ) : null}
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
                  <th>Index</th>
                  <th>Name</th>
                  <th>Action</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {elements.length ? (
                  elements.map(this.renderSupplierRow)
                ) : (
                  <tr>
                    <td colSpan="5">No suppliers available. Create your first one now!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="list__actions">
          <Link to={'/r/supplier/create'} className="btn btn--danger">
            Create Supplier
          </Link>
        </div>
        <div className="react-paginate">
          <ReactPaginate
            previousLabel={'previous'}
            nextLabel={'next'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={Math.ceil(list.length / this.state.perPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageClick}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
          />
        </div>
      </div>
    );
  }
}
