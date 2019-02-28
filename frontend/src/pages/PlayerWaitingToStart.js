import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Players from '../components/Players';

const PlayerWaitingToStart = ({ name, players, nickname }) => (
  <div>
    <h2>Waiting for host to start</h2>
    <h2>{`Room code: ${name}`}</h2>
    <Players players={players} nickname={nickname} />
  </div>
);
PlayerWaitingToStart.propTypes = {
  name: PropTypes.string,
  players: PropTypes.array,
  nickname: PropTypes.string.isRequired,
};
PlayerWaitingToStart.defaultProps = {
  name: '',
  players: [],
};
export default PlayerWaitingToStart;
