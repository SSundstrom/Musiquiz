import React from 'react';
import Scores from '../components/Scores';
import { GameConsumer } from '../game-context';

const Wait = () => (
  <GameConsumer>
    {context => (
      <React.Fragment>
        <h1>{context.state.guessTimer}</h1>
        <div>
          <h2>Waiting for other players</h2>
          <Scores />
        </div>
      </React.Fragment>
    )}
  </GameConsumer>
);

export default Wait;
