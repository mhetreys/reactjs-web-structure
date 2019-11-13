import React from 'react';

import Logo from './img/logo.png';

import './index.css';

export default function Header({ sidebarToggle }) {
  const onMenuClick = (event) => {
    event.preventDefault();

    sidebarToggle();
  };

  return (
    <header className="header header__fixed">
      <div className="container">
        <div className="header__content">
          <div className="header__brand">
            <a href="https://machadalo.com" target="_blank" rel="noopener noreferrer">
              <img src={Logo} alt="Machadalo" />
            </a>
          </div>
          <div className="header__links">
            <ul>
              <li>
                <span onClick={onMenuClick}>
                  <i className="fa fa-bars" />
                  Menu
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
