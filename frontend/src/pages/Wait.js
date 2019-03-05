import React from 'react';
import PropTypes from 'prop-types';
import PlayerWaitingToStart from './PlayerWaitingToStart';
import HostWaitingToStart from './HostWaitingToStart';

const Wait = ({ isHost, name, players, nickname }) => {
  if (isHost) {
    return <HostWaitingToStart name={name} players={players} />;
  }

  return <PlayerWaitingToStart name={name} players={players} nickname={nickname} />;
};
Wait.propTypes = {
  name: PropTypes.number,
  isHost: PropTypes.bool.isRequired,
  players: PropTypes.array,
  nickname: PropTypes.string,
};
Wait.defaultProps = {
  nickname: '',
  name: -1,
  players: [],
};

export default Wait;
