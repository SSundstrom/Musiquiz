import React from 'react';
import PropTypes from 'prop-types';
import Scores from '../components/Scores';

const LeaderWaitingForGuessers = ({ guessTimer }) => (
  <React.Fragment>
    <h1>{guessTimer}</h1>
    <h2>Waiting for guesses</h2>
    <Scores />
  </React.Fragment>
);
LeaderWaitingForGuessers.propTypes = {
  guessTimer: PropTypes.number.isRequired,
};
export default LeaderWaitingForGuessers;
