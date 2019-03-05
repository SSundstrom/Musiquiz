import React from 'react';
import Scores from '../components/Scores';
import GameStyles from '../components/styles/GameStyles';
import { GameConsumer } from '../game-context';

const LeaderWaitingForGuesses = () => (
  <GameConsumer>
    {context => (
      <GameStyles>
        <h1>{context.state.guessTimer}</h1>
        <h2>Waiting for guesses</h2>
        <Scores />
      </GameStyles>
    )}
  </GameConsumer>
);

export default LeaderWaitingForGuesses;
