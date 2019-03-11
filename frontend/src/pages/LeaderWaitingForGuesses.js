import React from 'react';
import Scores from '../components/Scores';
import { GameConsumer } from '../game-context';
import PlayerStyles from '../components/styles/PlayerStyles';

const LeaderWaitingForGuesses = () => (
  <GameConsumer>
    {context => (
      <PlayerStyles>
        <h1>{context.state.guessTimer}</h1>
        <h2>Waiting for guesses</h2>
        <Scores />
      </PlayerStyles>
    )}
  </GameConsumer>
);

export default LeaderWaitingForGuesses;
