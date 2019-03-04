import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Players from '../components/Players';

const HostWaitingToStart = ({ name, players }) => (
  <div>
    <h2>Waiting for more players</h2>
    <h2>{`Room code: ${name}`}</h2>
    <Players players={players} />
  </div>
);

HostWaitingToStart.propTypes = {
  name: PropTypes.string,
  players: PropTypes.array,
};
HostWaitingToStart.defaultProps = {
  name: '',
  players: [],
};
export default HostWaitingToStart;
