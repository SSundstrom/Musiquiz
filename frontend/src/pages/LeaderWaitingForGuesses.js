import React from 'react';
import PropTypes from 'prop-types';
import Scores from '../components/Scores';

const LeaderWaitingForGuesses = ({ players, nickname, guessTimer }) => (
  <div className="game">
    <h1>{guessTimer}</h1>
    <h2>Waiting for guesses</h2>
    <Scores players={players} nickname={nickname} />
  </div>
);

LeaderWaitingForGuesses.propTypes = {
  players: PropTypes.array.isRequired,
  nickname: PropTypes.string.isRequired,
  guessTimer: PropTypes.number.isRequired,
};
export default LeaderWaitingForGuesses;
