import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Base from './Base';
import Template from './Template';
import Campaigns from './Campaigns';
import List from './List';
import Edit from './Edit';
import AuditPlan from './AuditPlan';
import ManageImage from './ManageImage';

import './index.css';

export default class Booking extends React.Component {
  componentDidMount() {
    // TODO: Fetch supplier types
  }

  render() {
    const { match } = this.props;

    return (
      <div className="booking">
        <Switch>
          <Route
            path={`${match.path}/base`}
            render={(componentProps) => <Base {...this.props} {...componentProps} />}
          />
          <Route
            path={`${match.path}/template`}
            render={(componentProps) => <Template {...this.props} {...componentProps} />}
          />
          <Route
            exact
            path={`${match.path}/campaigns`}
            render={(componentProps) => <Campaigns {...this.props} {...componentProps} />}
          />
          <Route
            exact
            path={`${match.path}/list/:campaignId`}
            render={(componentProps) => <List {...this.props} {...componentProps} />}
          />
          <Route
            exact
            path={`${match.path}/create/:campaignId`}
            render={(componentProps) => <Edit {...this.props} {...componentProps} />}
          />
          <Route
            exact
            path={`${match.path}/edit/:campaignId/:bookingId`}
            render={(componentProps) => <Edit {...this.props} {...componentProps} />}
          />
          <Route
            exact
            path={`${match.path}/plan/:campaignId`}
            render={(componentProps) => <AuditPlan {...this.props} {...componentProps} />}
          />
          <Route
            exact
            path={`${match.path}/plan/:campaignId/image/supplier/:supplierId`}
            render={(componentProps) => <ManageImage {...this.props} {...componentProps} />}
          />
        </Switch>
      </div>
    );
  }
}
