import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Players from '../components/Players';

const HostWaitingToStart = ({ name, players }) => (
  <div className="game">
    <h2>Waiting for more players</h2>
    <h2>{`Room code: ${name}`}</h2>
    <Players players={players} />
  </div>
);

HostWaitingToStart.propTypes = {
  name: PropTypes.number,
  players: PropTypes.array,
};
HostWaitingToStart.defaultProps = {
  players: [],
  name: '',
};
export default HostWaitingToStart;
