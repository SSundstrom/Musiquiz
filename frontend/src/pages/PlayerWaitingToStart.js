import React from 'react';
import PropTypes from 'prop-types';
import Players from '../components/Players';
import GameStyles from '../components/styles/GameStyles';

const PlayerWaitingToStart = ({ name, players, nickname }) => (
  <GameStyles>
    <h2>Waiting for more players</h2>
    <h2>{`Room code: ${name}`}</h2>
    <Players players={players} nickname={nickname} />
  </GameStyles>
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
