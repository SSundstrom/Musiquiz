import React from 'react';
import PropTypes from 'prop-types';
import Players from '../components/Players';
import GameStyles from '../components/styles/GameStyles';

const HostWaitingToStart = ({ name, players }) => (
  <GameStyles>
    <h2>Waiting for more players</h2>
    <h2>{`Room code: ${name}`}</h2>
    <Players players={players} />
  </GameStyles>
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
