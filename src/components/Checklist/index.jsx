import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Campaigns from './Campaigns';
import Create from './Create';
import Suppliers from './Suppliers';
import List from './List';
import Fill from './Fill';
import Edit from './Edit';
import Settings from '../Settings';

import './index.css';

class Checklist extends React.Component {
  componentWillMount() {
    this.props.getloggedInProfilePermission();
  }

  render() {
    let { match } = this.props;

    return (
      <div className="checklist">
        <Switch>
          <Route
            exact
            path={`${match.path}/campaigns`}
            render={componentProps => (
              <Campaigns {...this.props} {...componentProps} />
            )}
          />
          <Route
            path={`${match.path}/suppliers/:campaignId`}
            render={componentProps => (
              <Suppliers {...this.props} {...componentProps} />
            )}
          />
          <Route
            path={`${match.path}/create/:campaignId/:supplierId`}
            render={componentProps => (
              <Create {...this.props} {...componentProps} />
            )}
          />
          <Route
            exact
            path={`${match.path}/create/:campaignId`}
            render={componentProps => (
              <Create {...this.props} {...componentProps} />
            )}
          />
          <Route
            path={`${match.path}/list/:campaignId/:supplierId`}
            render={componentProps => (
              <List {...this.props} {...componentProps} />
            )}
          />
          <Route
            exact
            path={`${match.path}/list/:campaignId`}
            render={componentProps => (
              <List {...this.props} {...componentProps} />
            )}
          />
          <Route
            path={`${match.path}/fill/:checklistId`}
            render={componentProps => (
              <Fill {...this.props} {...componentProps} />
            )}
          />
          <Route
            path={`${match.path}/edit/:checklistId`}
            render={componentProps => (
              <Edit {...this.props} {...componentProps} />
            )}
          />
          <Route
            path={`${match.path}/settings`}
            render={componentProps => (
              <Settings {...this.props} {...componentProps} />
            )}
          />
        </Switch>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(Checklist);
