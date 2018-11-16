import React from 'react';
import './NavBar.min.css';

function NavBar(props){
  return (
    <nav >
      <div className="nav-bar">
        <div className="logo">
          <div onClick={props.handleMenuClick} className="menu-expand">
            <svg svg width="24px" viewBox="0 0 24 24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
          </svg>
          </div>
        </div>
        <div className="search-area">
            <input className="header-search" type="text" value={props.searchterm} onChange={props.handleSearch} />
        </div>
      </div>
    </nav>
  );
}
export default NavBar;
