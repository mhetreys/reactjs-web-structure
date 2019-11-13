import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PermissionList from './PermissionList';

import './index.css';

export default class Settings extends React.Component {
  componentDidMount() {
    // TODO: Fetch entity types
  }

  render() {
    let { match } = this.props;

    return (
      <div className="settings">
        <Switch>
          <Route
            exact
            path={`${match.path}/permissions/list`}
            render={componentProps => (
              <PermissionList {...this.props} {...componentProps} />
            )}
          />
        </Switch>
      </div>
    );
  }
}
