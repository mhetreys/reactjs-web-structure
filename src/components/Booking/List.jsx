import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import mapSort from 'mapsort';

import CommentsModal from './../Modals/CommentsModal';
import Pagination from '../Pagination';
import PhaseModal from './../Modals/PhaseModal';
import ViewHashtagImagesModal from '../Modals/ViewHashtagImagesModal';
import FillAdditionalAttributeModal from './../Modals/AdditionalAttributesModal';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

let optionTypes = [
  { value: 'supplier', label: 'Supplier', type: 'dropdown' },
  { value: 'area', label: 'Area', type: 'dropdown' },
  { value: 'subarea', label: 'SubArea', type: 'dropdown' },
  { value: 'flat_count', label: 'Flat Count', type: 'slider' },
];

let dropdownOptions = {};

const getOption = (value) => {
  for (let i = 0, l = optionTypes.length; i < l; i += 1) {
    if (optionTypes[i] === value) {
      return optionTypes[i];
    }
  }

  return { value };
};

const getSorterByOrder = (order) => {
  if (order === 'asc') {
    return (a, b) => {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }

      return 0;
    };
  }

  return (a, b) => {
    if (a < b) {
      return 1;
    }
    if (a > b) {
      return -1;
    }

    return 0;
  };
};

export default class ListBooking extends Component {
  constructor() {
    super();

    this.state = {
      searchFilter: '',
      selectedBooking: null,
      isCommentsModalVisible: false,
      isPhaseModalVisible: false,
      isViewHashtagImagesModalVisible: false,
      selectedAdditionalAttribute: {},
      commentType: '',
      campaignName: '',
      selectedOption: optionTypes[0].value,
      selectedOptionLabel: optionTypes[0].label,
      selectedDropdownOption: '',
      isSearchInputVisible: false,
      sortOptions: {
        column: 'supplier',
        order: 'asc',
      },
      filterOptionTypes: [],
      appliedFilters: [],
      shouldShowError: false,
      value: { min: 0, max: 0 },
      rangeSliderOptions: {},
      isFloatOptionSelected: false,
      pageSize: 10,
      currentPage: 1,
    };

    this.onSearchFilterChange = this.onSearchFilterChange.bind(this);
    this.onCommentsChange = this.onCommentsChange.bind(this);
    this.onCommentsModalClose = this.onCommentsModalClose.bind(this);
    this.onManagePhaseClick = this.onManagePhaseClick.bind(this);
    this.onPhaseModalClose = this.onPhaseModalClose.bind(this);
    this.getFilteredList = this.getFilteredList.bind(this);
    this.renderBookingRow = this.renderBookingRow.bind(this);
    this.onViewImageClick = this.onViewImageClick.bind(this);
    this.onViewHashtagImagesModalClose = this.onViewHashtagImagesModalClose.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onOptionTypeChange = this.onOptionTypeChange.bind(this);
    this.onDropDownOptionTypeChange = this.onDropDownOptionTypeChange.bind(this);
    this.setOptionTypes = this.setOptionTypes.bind(this);
    this.getFilterOptions = this.getFilterOptions.bind(this);
    this.handleFilterAdd = this.handleFilterAdd.bind(this);
    this.renderAppliedFilters = this.renderAppliedFilters.bind(this);
    this.getFilterTags = this.getFilterTags.bind(this);
    this.removeFilterTag = this.removeFilterTag.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.paginate = this.paginate.bind(this);
  }

  componentDidMount() {
    this.props.getBookingList({ campaignId: this.getCampaignId() });
    this.props.getCampaignsList();
  }

  onSearchFilterChange(event) {
    this.setState({
      searchFilter: event.target.value,
    });
  }

  onCommentsChange(comments) {
    const { selectedBooking } = this.state;

    this.props.putBooking({
      id: selectedBooking.id,
      data: { ...selectedBooking, comments },
    });
  }

  onCommentsModalClose() {
    this.setState({
      isCommentsModalVisible: false,
      selectedBooking: null,
    });
  }

  onManagePhaseClick() {
    this.setState({
      isPhaseModalVisible: true,
    });
  }

  onPhaseModalClose() {
    this.setState({
      isPhaseModalVisible: false,
    });
  }

  getCampaignId() {
    const { match } = this.props;
    return match.params.campaignId;
  }

  onViewImageClick(item) {
    this.setState({
      isViewHashtagImagesModalVisible: true,
      selectedRow: item,
    });
  }

  onViewHashtagImagesModalClose() {
    this.setState({
      isViewHashtagImagesModalVisible: false,
    });
  }
  onFillAdditionalAttributeModalClose = () => {
    this.setState({
      isAdditionalAttributeModalVisible: false,
      selectedAdditionalAttribute: {},
      selectedBooking: null,
    });
  };
  onBack() {
    const { match } = this.props;
    this.props.history.push(`/r/booking/campaigns`);
  }

  handlePageChange(page) {
    this.setState({
      currentPage: page.selected + 1,
    });
  }

  getFilterTags() {
    const filterTags = [...this.state.appliedFilters];
    const {
      value,
      selectedOption,
      selectedOptionLabel,
      isSearchInputVisible,
      selectedDropdownOption,
    } = this.state;

    // Check if selected filter has already been applied
    const matchedFilter = filterTags.find((item) => item.fieldValue === selectedOption);
    if (matchedFilter) {
      alert('This filter category has already been added. Please select another category.');
      return filterTags;
    }

    let filterInput;
    if (isSearchInputVisible) {
      filterInput = value || '';
    } else {
      filterInput = selectedDropdownOption ? selectedDropdownOption : '';
    }

    const filterTag = {
      fieldLabel: selectedOptionLabel,
      fieldValue: selectedOption,
      query: filterInput,
    };

    if (filterTags.indexOf(filterTag) === -1) {
      filterTags.push(filterTag);
    } else {
      this.setState({ shouldShowError: true });
    }

    return filterTags;
  }

  handleFilterAdd() {
    const appliedFilters = this.getFilterTags();

    this.setState({ appliedFilters, currentPage: 1 });
  }

  getFilterOptions() {
    return optionTypes;
  }
  setOptionTypes(attributes, list) {
    dropdownOptions['supplier'] = [];
    dropdownOptions['area'] = [];
    dropdownOptions['subarea'] = [];
    list.forEach((element) => {
      dropdownOptions['supplier'].push({
        label: element.supplier_name,
        value: element.supplier_name,
      });
      if (element.additional_attributes.hasOwnProperty('location_details')) {
        element.additional_attributes.location_details.forEach((item) => {
          if (item.name === 'Area' || item.name === 'Sub Area') {
            dropdownOptions[item.name.toLowerCase().replace(/ /g, '')].push({
              label: item.value,
              value: item.value,
            });
          }
        });
      }
    });
    attributes.forEach((element) => {
      if (element.type === 'DROPDOWN') {
        optionTypes.push({
          label: element.name,
          value: element.name,
        });
        dropdownOptions[element.name] = [];
        element.options.forEach((option) => {
          dropdownOptions[element.name].push({
            label: option,
            value: option,
          });
        });
      }

      if (element.type === 'FLOAT') {
        optionTypes.push({
          label: element.name,
          value: element.name,
          type: 'slider',
        });
      }
    });

    this.setState({
      filterOptionTypes: optionTypes,
    });
  }

  getFilteredList(list) {
    let newList = [...list];

    const { appliedFilters } = this.state;
    for (let i = 0, l = appliedFilters.length; i < l; i += 1) {
      switch (appliedFilters[i].fieldValue) {
        case 'supplier':
          newList = newList.filter(
            (item) =>
              item.supplier_name.toLowerCase().indexOf(appliedFilters[i].query.toLowerCase()) !== -1
          );
          break;
        case 'area':
          newList = newList.filter(
            (item) =>
              item.additional_attributes.hasOwnProperty('location_details') &&
              item.additional_attributes.location_details[2].value
                .toLowerCase()
                .indexOf(appliedFilters[i].query.toLowerCase()) !== -1
          );
          break;
        case 'subarea':
          newList = newList.filter(
            (item) =>
              item.additional_attributes.hasOwnProperty('location_details') &&
              item.additional_attributes.location_details[3].value
                .toLowerCase()
                .indexOf(appliedFilters[i].query.toLowerCase()) !== -1
          );
          break;
        case 'flat_count':
          newList = newList.filter(
            (item) =>
              item.additional_attributes.hasOwnProperty('society_details') &&
              item.additional_attributes.society_details[0].hasOwnProperty('value') &&
              (item.additional_attributes.society_details[0].value >= appliedFilters[i].query.min &&
                item.additional_attributes.society_details[0].value <= appliedFilters[i].query.max)
          );
          break;
        case 'Booking Status':
          newList = newList.filter(
            (item) =>
              item.booking_attributes[2].hasOwnProperty('value') &&
              item.booking_attributes[2].value === appliedFilters[i].query
          );
          break;
        case 'Average Age':
          newList = newList.filter(
            (item) =>
              item.supplier_attributes[0].hasOwnProperty('value') &&
              item.supplier_attributes[0].value === appliedFilters[i].query
          );
          break;
        case 'NEFT Allowed':
          newList = newList.filter(
            (item) =>
              item.supplier_attributes[1].hasOwnProperty('value') &&
              item.supplier_attributes[1].value === appliedFilters[i].query
          );
          break;

        case 'Payment Status':
          newList = newList.filter(
            (item) =>
              item.booking_attributes[4].hasOwnProperty('value') &&
              item.booking_attributes[4].value === appliedFilters[i].query
          );
          break;
        case 'Total Price (Yearly)':
          newList = newList.filter(
            (item) =>
              item.booking_attributes[5].hasOwnProperty('value') &&
              (item.booking_attributes[5].value >= appliedFilters[i].query.min &&
                item.booking_attributes[5].value <= appliedFilters[i].query.max)
          );
          break;
        case 'Activation Price':
          newList = newList.filter(
            (item) =>
              item.booking_attributes[6].hasOwnProperty('value') &&
              (item.booking_attributes[6].value >= appliedFilters[i].query.min &&
                item.booking_attributes[6].value <= appliedFilters[i].query.max)
          );
          break;

        default:
          return newList;
      }
    }

    return newList;
  }

  getSortedList = (list) => {
    const { sortOptions } = this.state;

    const newList = [...list];

    switch (sortOptions.column) {
      case 'supplier':
        return mapSort(
          newList,
          (element) => element.supplier_name.toLowerCase(),
          getSorterByOrder(sortOptions.order)
        );

      case 'flat_count':
        return mapSort(
          newList,
          (element) => {
            if (
              element.additional_attributes &&
              element.additional_attributes.society_details &&
              element.additional_attributes.society_details[0]
            ) {
              return element.additional_attributes.society_details[0].value;
            }

            return 0;
          },
          getSorterByOrder(sortOptions.order)
        );

      case 'area':
        return mapSort(
          newList,
          (element) => {
            if (
              element.additional_attributes &&
              element.additional_attributes.location_details &&
              element.additional_attributes.location_details[2]
            ) {
              return element.additional_attributes.location_details[2].value;
            }

            return '';
          },
          getSorterByOrder(sortOptions.order)
        );

      default:
        const bookingAttributes =
          newList && newList[0] ? newList[0].booking_attributes.map((attr) => attr.name) : [];
        const bookingAttributesMatchIndex = bookingAttributes.indexOf(sortOptions.column);
        if (bookingAttributesMatchIndex !== -1) {
          return mapSort(
            newList,
            (element) => {
              if (
                element.booking_attributes &&
                element.booking_attributes[bookingAttributesMatchIndex]
              ) {
                return element.booking_attributes[bookingAttributesMatchIndex].value;
              }

              return '';
            },
            getSorterByOrder(sortOptions.order)
          );
        }

        const supplierAttributes =
          newList && newList[0] ? newList[0].supplier_attributes.map((attr) => attr.name) : [];
        const supplierAttributesMatchIndex = supplierAttributes.indexOf(sortOptions.column);
        if (supplierAttributesMatchIndex !== -1) {
          return mapSort(
            newList,
            (element) => {
              if (
                element.supplier_attributes &&
                element.supplier_attributes[supplierAttributesMatchIndex]
              ) {
                return element.supplier_attributes[supplierAttributesMatchIndex].value;
              }

              return '';
            },
            getSorterByOrder(sortOptions.order)
          );
        }

        return newList;
    }
  };

  onOptionTypeChange(option) {
    if (option.type == 'slider') {
      const list = this.props.booking.bookingList;
      let options = { ...this.state.rangeSliderOptions };
      options[option.value] = {
        values: [],
        max: 0,
        min: 0,
      };

      if (option.value == 'flat_count') {
        list.forEach((element) => {
          if (
            element.additional_attributes.hasOwnProperty('society_details') &&
            element.additional_attributes.society_details[0].hasOwnProperty('value')
          ) {
            options[option.value].values.push(
              element.additional_attributes.society_details[0].value
            );
            options[option.value].max = Math.max(...options[option.value].values);
            options[option.value].min = Math.min(...options[option.value].values);
            this.setState({
              value: {
                max: options[option.value].max,
                min: options[option.value].min,
              },
            });
          }
        });

        this.setState({
          selectedOption: option.value,
          selectedOptionLabel: option.label,
          isSearchInputVisible: true,
          selectedDropdownOption: undefined,
          rangeSliderOptions: options,
          isFloatOptionSelected: false,
        });
      } else {
        list.forEach((element) => {
          let attributes = element.supplier_attributes.concat(element.booking_attributes);
          let labels = [];
          attributes.forEach((item) => {
            labels.push(item.name);
          });
          let index = labels.indexOf(option.value);
          if (attributes[index].hasOwnProperty('value')) {
            options[option.value].values.push(attributes[index].value);
          }
          options[option.value].max = Math.ceil(Math.max(...options[option.value].values));
          options[option.value].min = Math.floor(Math.min(...options[option.value].values));
          this.setState({
            value: {
              max: options[option.value].max,
              min: options[option.value].min,
            },
          });
        });

        this.setState({
          selectedOption: option.value,
          selectedOptionLabel: option.label,
          isSearchInputVisible: true,
          selectedDropdownOption: undefined,
          rangeSliderOptions: options,
          isFloatOptionSelected: true,
        });
      }
    } else {
      this.setState({
        selectedOption: option.value,
        selectedOptionLabel: option.label,
        isSearchInputVisible: false,
        selectedDropdownOption: undefined,
        isFloatOptionSelected: false,
      });
    }
  }

  onDropDownOptionTypeChange(option) {
    this.setState({
      selectedDropdownOption: option.value,
      searchFilter: undefined,
    });
  }

  setSortOrder = (column) => {
    this.setState((prevState) => {
      let order = 'asc';

      // If sorting on same column as before, just swap the sort order
      if (prevState.sortOptions.column === column) {
        order = prevState.sortOptions.order === 'asc' ? 'desc' : 'asc';
      }

      return {
        sortOptions: {
          column,
          order,
        },
      };
    });
  };

  paginate(list, currentPage, pageSize) {
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    return list.slice(indexOfFirstItem, indexOfLastItem);
  }

  renderBookingRow(booking) {
    const onComments = (type) => {
      this.setState({
        selectedBooking: booking,
        isCommentsModalVisible: true,
        commentType: type,
      });
    };

    const viewImageClick = () => {
      this.onViewImageClick(booking);
    };

    const onRemove = () => {
      if (window.confirm('Are you sure you want to remove this booking?')) {
        this.props.deleteBooking(booking);
      }
    };

    const onFillAdditionalAttributeModalClick = (attribute_type) => {
      if (
        booking &&
        booking['additional_attributes'] &&
        booking['additional_attributes'][attribute_type]
      ) {
        this.setState({
          selectedBooking: booking,
          isAdditionalAttributeModalVisible: true,
          selectedAdditionalAttribute: booking['additional_attributes'][attribute_type],
          selectedFieldName: attribute_type,
        });
      }
    };

    const { isViewHashtagImagesModalVisible, selectedBooking } = this.state;

    return (
      <tr key={booking.id}>
        <td>{booking.supplier_name}</td>
        {booking.supplier_attributes.map((attribute) => (
          <td>
            {attribute.type === 'STRING' ||
            attribute.type === 'FLOAT' ||
            attribute.type === 'EMAIL' ||
            attribute.type === 'DROPDOWN'
              ? attribute.value
              : attribute.type}
          </td>
        ))}
        {booking.booking_attributes.map((attribute) => (
          <td>
            {attribute.type === 'HASHTAG' && attribute.files ? (
              <button type="button" className="btn btn--danger" onClick={viewImageClick}>
                View Images ({attribute.files.length})
              </button>
            ) : (
              attribute.value
            )}
            {isViewHashtagImagesModalVisible && attribute.type === 'HASHTAG' && attribute.files ? (
              <ViewHashtagImagesModal
                onClose={this.onViewHashtagImagesModalClose}
                isVisible={isViewHashtagImagesModalVisible}
                item={attribute.files}
              />
            ) : null}
          </td>
        ))}
        {booking &&
        booking.additional_attributes &&
        booking.additional_attributes.society_details ? (
          <td>
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => onFillAdditionalAttributeModalClick('society_details')}
            >
              {booking.additional_attributes.society_details[0]
                ? booking.additional_attributes.society_details[0].value
                : 'Society Details'}
            </button>
          </td>
        ) : null}
        {booking &&
        booking.additional_attributes &&
        booking.additional_attributes.location_details ? (
          <td>
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => onFillAdditionalAttributeModalClick('location_details')}
            >
              {booking.additional_attributes.location_details[3].value
                ? booking.additional_attributes.location_details[3].value
                : ''}
              ,
              {booking.additional_attributes.location_details[2].value
                ? booking.additional_attributes.location_details[2].value
                : 'Location Details'}
            </button>
          </td>
        ) : null}

        {booking &&
        booking.additional_attributes &&
        booking.additional_attributes.contact_details ? (
          <td>
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => onFillAdditionalAttributeModalClick('contact_details')}
            >
              {booking.additional_attributes.contact_details[3].value
                ? booking.additional_attributes.contact_details[3].value
                : 'Contact Details'}
            </button>
          </td>
        ) : null}

        {booking && booking.additional_attributes && booking.additional_attributes.bank_details ? (
          <td>
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => onFillAdditionalAttributeModalClick('bank_details')}
            >
              {booking.additional_attributes.bank_details[2].value
                ? booking.additional_attributes.bank_details[2].value
                : 'Bank Details'}
            </button>
          </td>
        ) : null}

        <td>
          <button type="button" className="btn btn--danger" onClick={() => onComments('INTERNAL')}>
            Internal Comments
          </button>
        </td>
        <td>
          <button type="button" className="btn btn--danger" onClick={() => onComments('EXTERNAL')}>
            External Comments
          </button>
        </td>
        <td>
          <Link
            to={`/r/booking/edit/${this.getCampaignId()}/${booking.id}`}
            className="btn btn--danger"
          >
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

  removeFilterTag(filterTag) {
    const updatedFilters = this.state.appliedFilters.filter((item) => {
      return item.fieldValue !== filterTag.fieldValue;
    });

    this.setState({ appliedFilters: updatedFilters });
  }

  renderAppliedFilters(filterTag, index) {
    console.log('filterTag: ', filterTag);
    const queryLabel =
      typeof filterTag.query === 'object'
        ? `${filterTag.query.min}-${filterTag.query.max}`
        : `${filterTag.query}`;
    return (
      <div className="list__filter-tag">
        <i key={index} className="fa fa-times" onClick={() => this.removeFilterTag(filterTag)} />
        &nbsp;
        {`${filterTag.fieldLabel}: ${queryLabel}`}
      </div>
    );
  }

  renderSortIcon = (column) => {
    const { sortOptions } = this.state;
    if (column !== sortOptions.column) return null;

    return (
      <i
        className={classnames('fa', 'sort', {
          'fa-sort-asc': sortOptions.order === 'asc',
          'fa-sort-desc': sortOptions.order === 'desc',
        })}
      />
    );
  };

  render() {
    const {
      searchFilter,
      selectedBooking,
      isCommentsModalVisible,
      isPhaseModalVisible,
      isViewHashtagImagesModalVisible,
      commentType,
      isSearchInputVisible,
      selectedOption,
      filterOptionTypes,
      rangeSliderOptions,
      pageSize,
      currentPage,
    } = this.state;
    const { booking } = this.props;
    const { bookingList } = booking;
    let list = this.getFilteredList(bookingList);
    list = this.getSortedList(list);
    const finalList = this.paginate(list, currentPage, pageSize);

    let attributes = [];
    let campaignName = '';
    const { campaign } = this.props;
    let campaignId = this.getCampaignId();
    if (campaign && campaign.objectById && campaign.objectById[campaignId]) {
      campaignName = campaign.objectById[campaignId].name;
    }

    if (list && list.length) {
      attributes = list[0].supplier_attributes.concat(list[0].booking_attributes);
      if (optionTypes.length < 5) {
        this.setOptionTypes(attributes, list);
      }
    }
    let dropdownOptionsTypes = dropdownOptions;
    const volume = 4;

    return (
      <div className="booking__list list">
        <div className="list__title">
          <h3>Booking - Plan ({campaignName})</h3>
        </div>
        <button type="button" className="btn btn--danger" onClick={this.onBack}>
          <i className="fa fa-arrow-left" aria-hidden="true" />
          &nbsp; Back
        </button>

        <div className="list__filter-tags-container">
          {this.state.appliedFilters.length
            ? this.state.appliedFilters.map(this.renderAppliedFilters)
            : null}
        </div>

        <div className="list__filter">
          <div className="list__filter__field">
            <Select
              options={filterOptionTypes}
              className="select"
              value={this.selectedOption}
              onChange={this.onOptionTypeChange}
              defaultValue={optionTypes[0]}
            />
          </div>
          <div className="list__filter__query">
            {isSearchInputVisible ? (
              <InputRange
                maxValue={rangeSliderOptions[selectedOption].max}
                minValue={rangeSliderOptions[selectedOption].min}
                value={this.state.value}
                onChange={(value) => this.setState({ value })}
              />
            ) : (
              <Select
                options={dropdownOptionsTypes[selectedOption]}
                className="select"
                value={this.selectedDropdownOption}
                onChange={this.onDropDownOptionTypeChange}
              />
            )}
          </div>
          <div className="list__filter__action">
            <button type="button" className="btn btn--danger" onClick={this.handleFilterAdd}>
              Apply Filters
            </button>
          </div>
        </div>

        <div className="list__table">
          <table cellPadding="0" cellSpacing="0">
            <thead>
              <tr>
                <th onClick={() => this.setSortOrder('supplier')}>
                  Supplier Name
                  {this.renderSortIcon('supplier')}
                </th>
                {attributes.map((attribute) => (
                  <th onClick={() => this.setSortOrder(attribute.name)}>
                    {attribute.name}
                    {this.renderSortIcon(attribute.name)}
                  </th>
                ))}

                {list && list[0] && list[0].additional_attributes ? (
                  Object.keys(list[0].additional_attributes).indexOf('society_details') > -1 ? (
                    <th onClick={() => this.setSortOrder('flat_count')}>
                      Society Details
                      {this.renderSortIcon('flat_count')}
                    </th>
                  ) : null
                ) : null}

                {list && list[0] && list[0].additional_attributes ? (
                  Object.keys(list[0].additional_attributes).indexOf('location_details') > -1 ? (
                    <th onClick={() => this.setSortOrder('area')}>
                      Location
                      {this.renderSortIcon('area')}
                    </th>
                  ) : null
                ) : null}

                {list && list[0] && list[0].additional_attributes ? (
                  Object.keys(list[0].additional_attributes).indexOf('contact_details') > -1 ? (
                    <th>Contact Details</th>
                  ) : null
                ) : null}

                {list && list[0] && list[0].additional_attributes ? (
                  Object.keys(list[0].additional_attributes).indexOf('bank_details') > -1 ? (
                    <th>Bank Details</th>
                  ) : null
                ) : null}

                <th>Comments</th>
                <th>Comments</th>
                <th>Edit</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {list && list.length ? (
                finalList.map(this.renderBookingRow)
              ) : (
                <tr>
                  <td colSpan="5">No booking templates available. Create your first one now!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="list__footer">
          <Pagination
            pageSize={pageSize}
            totalItems={list.length}
            handlePageClick={this.handlePageChange}
          />
        </div>

        <div className="list__actions">
          <Link to={`/r/booking/create/${this.getCampaignId()}`} className="btn btn--danger">
            Add
          </Link>
          <Link to={`/r/booking/plan/${this.getCampaignId()}`} className="btn btn--danger">
            Campaign Release and Audit Plan
          </Link>
          <button type="button" className="btn btn--danger" onClick={this.onManagePhaseClick}>
            Manage Phases
          </button>
        </div>

        {selectedBooking ? (
          <FillAdditionalAttributeModal
            key={this.state.selectedAdditionalAttribute}
            isVisible={this.state.isAdditionalAttributeModalVisible}
            attributes={this.state.selectedAdditionalAttribute}
            onClose={this.onFillAdditionalAttributeModalClose}
            isDisabled={true}
          />
        ) : null}

        {selectedBooking ? (
          <CommentsModal
            comments={selectedBooking.comments || {}}
            onChange={this.onCommentsChange}
            onClose={this.onCommentsModalClose}
            isVisible={isCommentsModalVisible}
            user={this.props.user.currentUser}
            commentType={commentType}
          />
        ) : null}

        <PhaseModal
          {...this.props}
          onClose={this.onPhaseModalClose}
          isVisible={isPhaseModalVisible}
          campaign={{ campaignId: this.getCampaignId() }}
        />
      </div>
    );
  }
}
