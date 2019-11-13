import React from 'react';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';

import './index.css';

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hideChecklistDropdown: true,
      hideLeadsDropdown: true,
      hideEntitiesDropdown: true,
      hideInventoryDropdown: true,
      hideBookingDropdown: true,
    };

    this.toggleChecklistDropdown = this.toggleChecklistDropdown.bind(this);
    this.toggleLeadsDropdown = this.toggleLeadsDropdown.bind(this);
    this.toggleEntitiesDropdown = this.toggleEntitiesDropdown.bind(this);
    this.toggleInventoryDropdown = this.toggleInventoryDropdown.bind(this);
    this.toggleBookingDropdown = this.toggleBookingDropdown.bind(this);
  }

  toggleChecklistDropdown() {
    this.setState({
      hideChecklistDropdown: !this.state.hideChecklistDropdown,
    });
  }

  toggleLeadsDropdown() {
    this.setState({
      hideLeadsDropdown: !this.state.hideLeadsDropdown,
    });
  }

  toggleEntitiesDropdown() {
    this.setState({
      hideEntitiesDropdown: !this.state.hideEntitiesDropdown,
    });
  }

  toggleInventoryDropdown() {
    this.setState({
      hideInventoryDropdown: !this.state.hideInventoryDropdown,
    });
  }

  toggleBookingDropdown() {
    this.setState({
      hideBookingDropdown: !this.state.hideBookingDropdown,
    });
  }

  render() {
    let { appearance } = this.props;
    return (
      <aside
        className={classnames('sidebar', {
          'sidebar--collapsed': !appearance.isSidebarVisible,
        })}
      >
        <div className="sidebar__menu">
          <div className="sidebar__menu__list">
            <ul>
              <li>
                <a href="/#/manageCampaign/create">
                  <i className="fa fa-tasks" aria-hidden="true" />
                  Home
                </a>
              </li>
              <li>
                <a href="/#/dashboard">
                  <i className="fa fa-dashboard" aria-hidden="true" />
                  DashBoard
                </a>
              </li>
              <li>
                <a href="/#/manageUser">
                  <i className="fa fa-outdent" aria-hidden="true" />
                  Management
                </a>
              </li>
              <li>
                <a href="/#/OpsDashBoard">
                  <i className="fa fa-dashboard" aria-hidden="true" />
                  OpsDashBoard
                </a>
              </li>
              <li>
                <a href="/#/CampaignList">
                  <i className="fa fa-list" aria-hidden="true" />
                  List Campaigns
                </a>
              </li>
              <li className="dropdown-list-parent">
                <div className="parent-list" onClick={this.toggleLeadsDropdown}>
                  <i className="fa fa-check-square-o" aria-hidden="true" />
                  Leads
                  <i
                    className={classnames('fa', 'caret', {
                      'fa-caret-right': this.state.hideLeadsDropdown,
                      'fa-caret-down': !this.state.hideLeadsDropdown,
                    })}
                    aria-hidden="true"
                  />
                </div>
                <ul className="dropdown-list-child" hidden={this.state.hideLeadsDropdown}>
                  <li>
                    <a href="/#/campaignLeads">
                      <i className="fa fa-dashboard" aria-hidden="true" />
                      Campaign
                    </a>
                  </li>
                  <li>
                    <NavLink to="/r/leads/settings">Settings</NavLink>
                  </li>
                </ul>
              </li>
              <li className="dropdown-list-parent">
                <div className="parent-list" onClick={this.toggleEntitiesDropdown}>
                  <i className="fa fa-cubes" aria-hidden="true" />
                  Suppliers
                  <i
                    className={classnames('fa', 'caret', {
                      'fa-caret-right': this.state.hideEntitiesDropdown,
                      'fa-caret-down': !this.state.hideEntitiesDropdown,
                    })}
                    aria-hidden="true"
                  />
                </div>
                <ul className="dropdown-list-child" hidden={this.state.hideEntitiesDropdown}>
                  <li>
                    <NavLink to="/r/supplier/base-type/list">Standard Template</NavLink>
                  </li>
                  <li>
                    <NavLink to="/r/supplier/type/list">Supplier Template</NavLink>
                  </li>
                  <li>
                    <NavLink to="/r/supplier/list">Manage Supplier</NavLink>
                  </li>
                </ul>
              </li>
              <li className="dropdown-list-parent">
                <div className="parent-list" onClick={this.toggleInventoryDropdown}>
                  <i className="fa fa-cogs" aria-hidden="true" />
                  Inventory
                  <i
                    className={classnames('fa', 'caret', {
                      'fa-caret-right': this.state.hideInventoryDropdown,
                      'fa-caret-down': !this.state.hideInventoryDropdown,
                    })}
                    aria-hidden="true"
                  />
                </div>
                <ul className="dropdown-list-child" hidden={this.state.hideInventoryDropdown}>
                  <li>
                    <NavLink to="/r/inventory/base/list">Standard Template</NavLink>
                  </li>

                  <li>
                    <NavLink to="/r/inventory/list">Inventory Template</NavLink>
                  </li>
                </ul>
              </li>
              <li className="dropdown-list-parent">
                <div className="parent-list" onClick={this.toggleChecklistDropdown}>
                  <i className="fa fa-check-square-o" aria-hidden="true" />
                  Checklists
                  <i
                    className={classnames('fa', 'caret', {
                      'fa-caret-right': this.state.hideChecklistDropdown,
                      'fa-caret-down': !this.state.hideChecklistDropdown,
                    })}
                    aria-hidden="true"
                  />
                </div>
                <ul className="dropdown-list-child" hidden={this.state.hideChecklistDropdown}>
                  <li>
                    <NavLink to="/r/checklist/campaigns">Campaign</NavLink>
                  </li>
                  <li>
                    <NavLink to="/r/checklist/settings/permissions/list">Settings</NavLink>
                  </li>
                </ul>
              </li>
              <li className="dropdown-list-parent">
                <div className="parent-list" onClick={this.toggleBookingDropdown}>
                  <i className="fa fa-check-square-o" aria-hidden="true" />
                  Booking Engine
                  <i
                    className={classnames('fa', 'caret', {
                      'fa-caret-right': this.state.hideBookingDropdown,
                      'fa-caret-down': !this.state.hideBookingDropdown,
                    })}
                    aria-hidden="true"
                  />
                </div>
                <ul className="dropdown-list-child" hidden={this.state.hideBookingDropdown}>
                  <li>
                    <NavLink to="/r/booking/base/list">Standard Template</NavLink>
                  </li>
                  <li>
                    <NavLink to="/r/booking/template/list">Booking Templates</NavLink>
                  </li>
                  <li>
                    <NavLink to="/r/booking/campaigns">Manage Booking</NavLink>
                  </li>
                </ul>
              </li>
              <li>
                <a href="/#/logout">
                  <i className="fa fa-sign-out" aria-hidden="true" />
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    );
  }
}
