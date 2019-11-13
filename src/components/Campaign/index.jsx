import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import './index.css';
import Pagination from '../Pagination';

export default class Campaigns extends React.Component {
  constructor() {
    super();

    this.state = {
      searchFilter: '',
      pageSize: 10,
      currentPage: 1,
    };

    this.onSearchFilterChange = this.onSearchFilterChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.getFilteredList = this.getFilteredList.bind(this);
    this.paginate = this.paginate.bind(this);
    this.renderCampaignRow = this.renderCampaignRow.bind(this);
  }

  componentDidMount() {
    this.props.getCampaignsList();
  }

  onSearchFilterChange(event) {
    this.setState({
      searchFilter: event.target.value,
      currentPage: 1,
    });
  }

  paginate(list, currentPage, pageSize) {
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    return list.slice(indexOfFirstItem, indexOfLastItem);
  }

  handlePageChange(page) {
    this.setState({
      currentPage: page.selected + 1,
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

  renderCampaignRow(campaign) {
    const { actions } = this.props;

    return (
      <tr key={campaign.id}>
        <td>{campaign.name}</td>
        {/* <td>{campaign.assigned_to.username}</td> */}
        {/* <td>{campaign.assigned_by.username}</td> */}
        <td>{moment(campaign.created_at).format('Do MMM, YYYY')}</td>
        <td>{moment(campaign.tentative_start_date).format('Do MMM, YYYY')}</td>
        <td>{moment(campaign.tentative_end_date).format('Do MMM, YYYY')}</td>
        <td>
          {actions.map((item, index) => {
            return (
              <Link
                key={index}
                to={`${item.href}/${campaign.proposal_id}`}
                className="btn btn--danger"
              >
                {item.buttonLabel}
              </Link>
            );
          })}
        </td>
        <td>
          {actions.map((item, index) => {
            return (
              <Link
                key={index}
                to={`/r/booking/plan/${campaign.proposal_id}`}
                className="btn btn--danger"
              >
                Assign Dates
              </Link>
            );
          })}
        </td>
      </tr>
    );
  }

  render() {
    const { searchFilter, pageSize, currentPage } = this.state;
    const { campaign, actions } = this.props;
    const filteredList = this.getFilteredList(campaign.list);
    const list = this.paginate(filteredList, currentPage, pageSize);

    return (
      <div className="campaign">
        <div className="list">
          <div className="list__title">
            <h3>Campaigns</h3>
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
                  <th>Campaign Name</th>
                  {/* <th>Assigned To</th> */}
                  {/* <th>Assigned By</th> */}
                  <th>Assigned Date</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  {actions.map((item, index) => (
                    <th key={index}>{item.headerLabel}</th>
                  ))}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{list.map(this.renderCampaignRow)}</tbody>
            </table>
          </div>
          <div className="list__footer">
            <Pagination
              pageSize={pageSize}
              totalItems={filteredList.length}
              handlePageClick={this.handlePageChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
