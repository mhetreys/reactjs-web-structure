import React from 'react';
import { Route, Switch } from 'react-router-dom';

import BaseCreate from './Base/Create';
import BaseList from './Base/List';
import BaseEdit from './Base/Edit';

import List from './Inventory/List';
import Create from './Inventory/Create';

import './index.css';

export default class Inventory extends React.Component {
  componentDidMount() {
    // TODO: Fetch inventory types
  }

  render() {
    let { match } = this.props;

    return (
      <div className="inventory">
        <Switch>
          {/* Base Inventory */}
          <Route
            exact
            path={`${match.path}/base/create`}
            render={(componentProps) => <BaseCreate {...this.props} {...componentProps} />}
          />
          <Route
            exact
            path={`${match.path}/base/list`}
            render={(componentProps) => <BaseList {...this.props} {...componentProps} />}
          />
          <Route
            exact
            path={`${match.path}/base/edit/:baseInventoryId`}
            render={(componentProps) => <BaseEdit {...this.props} {...componentProps} />}
          />

          {/* Inventory */}
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
            path={`${match.path}/edit/:inventoryId`}
            render={(componentProps) => <Create {...this.props} {...componentProps} />}
          />
        </Switch>
      </div>
    );
  }
}
