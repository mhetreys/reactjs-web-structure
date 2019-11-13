import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import './index.css';

export default class Campaigns extends React.Component {
  constructor() {
    super();

    this.state = {
      searchFilter: '',
    };

    this.renderCampaignRow = this.renderCampaignRow.bind(this);
    this.onSearchFilterChange = this.onSearchFilterChange.bind(this);
    this.getFilteredList = this.getFilteredList.bind(this);
  }

  componentDidMount() {
    this.props.getCampaignsList();
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

  renderCampaignRow(campaign) {
    return (
      <tr key={campaign.id}>
        <td className="campaign-name">{campaign.name}</td>
        <td className="hidden-xs">
          {moment(campaign.tentative_start_date).format('Do MMM, YYYY')}
        </td>
        <td className="hidden-xs">{moment(campaign.tentative_end_date).format('Do MMM, YYYY')}</td>
        <td className="visible-xs">
          {moment(campaign.tentative_start_date).format('DD/MM/YY')}
          {' - '}
          {moment(campaign.tentative_end_date).format('DD/MM/YY')}
        </td>
        <td>
          <Link to={`/r/checklist/suppliers/${campaign.proposal_id}`} className="btn btn--danger">
            Select Supplier
          </Link>
        </td>
        <td>
          <Link to={`/r/checklist/list/${campaign.proposal_id}`} className="btn btn--danger">
            View Checklists
          </Link>
        </td>
      </tr>
    );
  }

  render() {
    const { campaign } = this.props;

    const filteredList = this.getFilteredList(campaign.list);

    return (
      <div className="list">
        <div className="list__title">
          <h3>Campaign Checklist</h3>
        </div>
        <div className="list__filter">
          <input
            type="text"
            placeholder="Search..."
            onChange={this.onSearchFilterChange}
            value={this.state.searchFilter}
          />
        </div>
        <div className="list__table">
          <table cellPadding="0" cellSpacing="0">
            <thead>
              <tr>
                <th className="campaign-name">Campaign Name</th>
                <th className="hidden-xs">Start Date</th>
                <th className="hidden-xs">End Date</th>
                <th className="visible-xs">Start - End</th>
                <th>Action</th>
                <th>Checklist</th>
              </tr>
            </thead>
            <tbody>{filteredList.map(this.renderCampaignRow)}</tbody>
          </table>
        </div>
      </div>
    );
  }
}
