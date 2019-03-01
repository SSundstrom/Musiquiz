import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Scores from '../components/Scores';

const LeaderWaitingForGuesses = ({ scores, scoreUpdates, nickname, guessTimer }) => (
  <div>
    <h1>{guessTimer}</h1>
    <h2>Waiting for guesses</h2>
    <Scores scores={scores} nickname={nickname} scoreUpdates={scoreUpdates} />
  </div>
);

LeaderWaitingForGuesses.propTypes = {
  scores: PropTypes.object.isRequired,
  scoreUpdates: PropTypes.object.isRequired,
  nickname: PropTypes.string.isRequired,
  guessTimer: PropTypes.number.isRequired,
};
export default LeaderWaitingForGuesses;
