import React from 'react';
import { Link } from 'react-router-dom';

import '../Checklist/index.css';

export default class Forms extends React.Component {
  constructor() {
    super();

    this.renderFormRow = this.renderFormRow.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    this.props.getCampaignsFormList({
      campaignId: match.params.campaignId,
    });
  }
  componentDidUpdate() {
    console.log(this.props.leads.campaignsFormList);
  }

  renderFormRow(campaignsFormList) {
    console.log(campaignsFormList);
    return (
      <tr key={campaignsFormList.leads_form_id}>
        <td>{campaignsFormList.leads_form_name}</td>
        <td>
          <Link
            to={`/r/leads/${this.props.match.params.campaignId}/editForm/${
              campaignsFormList.leads_form_id
            }`}
            className="btn btn--danger"
          >
            Form Details
          </Link>
        </td>
        <td>
          <Link to={`/r/leads/`} className="btn btn--danger">
            View Leads
          </Link>
        </td>
        <td>
          <Link to={`/r/leads/`} className="btn btn--danger">
            Enter Leads
          </Link>
        </td>
        <td>
          <Link to={`/r/leads/}`} className="btn btn--danger">
            Import Leads
          </Link>
        </td>
      </tr>
    );
  }

  render() {
    const { campaignsFormList } = this.props.leads;
    console.log(this.props);

    return (
      <div className="list">
        <div className="list__title">
          <h3>Campaign Leads Form List</h3>
        </div>
        <div className="list__filter">
          <input type="text" placeholder="Search..." />
        </div>
        <div className="list__table">
          <table cellPadding="0" cellSpacing="0">
            <thead>
              <tr>
                <th>Form Name</th>
                <th>Action</th>
                <th>View Leads</th>
                <th>Enter Leads</th>
                <th>Import Leads</th>
              </tr>
            </thead>
            <tbody>{campaignsFormList.map(this.renderFormRow)}</tbody>
          </table>
        </div>
        <div>
          <br />
          <Link
            to={`/r/leads/${this.props.match.params.campaignId}/createForm`}
            className="btn btn--danger"
          >
            Create Lead Form
          </Link>
        </div>
      </div>
    );
  }
}
