import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Players from '../components/Players';

const HostWaitingToStart = ({ name, players, onStartGame }) => (
  <div>
    <h2>Waiting for players</h2>
    <h2>{`Room code: ${name}`}</h2>
    {players.length > 1 && (
      <button type="button" className="button" onClick={() => onStartGame()}>
        Start game
      </button>
    )}
    <Players players={players} />
  </div>
);

HostWaitingToStart.propTypes = {
  name: PropTypes.string,
  players: PropTypes.array,
  onStartGame: PropTypes.func.isRequired,
};
HostWaitingToStart.defaultProps = {
  name: '',
  players: [],
};
export default HostWaitingToStart;
