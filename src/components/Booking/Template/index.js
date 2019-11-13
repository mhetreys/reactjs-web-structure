import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import List from './List';
import Create from './Create';

import './index.css';

export default class BookingTemplate extends Component {
  componentDidMount() {
    // TODO: Fetch supplier types
  }

  render() {
    const { match } = this.props;

    return (
      <div className="booking-template">
        <Switch>
          <Route
            exact
            path={`${match.path}/list`}
            render={(componentProps) => <List {...this.props} {...componentProps} />}
          />
          <Route
            exact
            path={`${match.path}/create`}
            render={(componentProps) => <Create {...this.props} {...componentProps} />}
          />
          <Route
            exact
            path={`${match.path}/edit/:bookingTemplateId`}
            render={(componentProps) => <Create {...this.props} {...componentProps} />}
          />
        </Switch>
      </div>
    );
  }
}
