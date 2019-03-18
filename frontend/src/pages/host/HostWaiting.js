/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import QR from '../../components/QR';
import HostScreenStyles from '../../components/styles/HostScreenStyles';

const HostWaiting = ({ name }) => (
  <HostScreenStyles>
    <QR name={name} className="qr" size={256} value={`${window.location.href.replace('#', '')}${name}`} />
    <div className="game">
      <h1>Waiting for players</h1>
    </div>
  </HostScreenStyles>
);
HostWaiting.propTypes = {
  name: PropTypes.string.isRequired,
};
export default HostWaiting;
