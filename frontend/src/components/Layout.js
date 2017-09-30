import * as React from 'react';
import Logo from './Logo';

const Layout = (props) => (
  <div className="wrapper">
    <div className="navbar">
      <Logo />
    </div>
    
    <div className="content">
      {props.children}
    </div>
  </div>
);

export default Layout;