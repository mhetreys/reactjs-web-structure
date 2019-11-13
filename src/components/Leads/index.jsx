import React from 'react';
import { Route, Switch } from 'react-router-dom';

import LeadSettings from './LeadSettings';
import Campaigns from './Campaigns';
import Forms from './Forms';
import CreateForm from './CreateForm';
import EditForm from './EditForm';

export default class Leads extends React.Component {
  componentDidMount() {
    // TODO: Fetch entity types
  }

  render() {
    let { match } = this.props;

    return (
      <div className="checklist">
        <Switch>
          <Route
            exact
            path={`${match.path}/settings`}
            render={(componentProps) => <LeadSettings {...this.props} {...componentProps} />}
          />
          <Route
            exact
            path={`${match.path}/campaigns`}
            render={(componentProps) => <Campaigns {...this.props} {...componentProps} />}
          />
          <Route
            exact
            path={`${match.path}/:campaignId/form`}
            render={(componentProps) => <Forms {...this.props} {...componentProps} />}
          />
          <Route
            exact
            path={`${match.path}/:campaignId/createForm`}
            render={(componentProps) => <CreateForm {...this.props} {...componentProps} />}
          />
          <Route
            exact
            path={`${match.path}/:campaignId/editForm/:leadFormId`}
            render={(componentProps) => <EditForm {...this.props} {...componentProps} />}
          />
        </Switch>
      </div>
    );
  }
}
