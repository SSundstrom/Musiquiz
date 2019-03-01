import * as React from 'react';
import PropTypes from 'prop-types';
import Logo from './Logo';

const Layout = ({ isLeader, isHost, children }) => (
  <div className={`background ${isLeader ? 'is-leader ' : ''}${isHost ? 'is-host ' : ''}`}>
    <div className="wrapper">
      <div className="navbar">
        <Logo />
      </div>

      <div className="content">{children}</div>
    </div>
  </div>
);
Layout.propTypes = {
  isLeader: PropTypes.bool.isRequired,
  isHost: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};
Layout.defaultProps = {
  children: null,
};
export default Layout;
