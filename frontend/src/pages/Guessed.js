import React from 'react';
import Scores from '../components/Scores';
import { PlayerContextConsumer } from '../context/playerContext';

const Wait = () => (
  <PlayerContextConsumer>
    {context => (
      <React.Fragment>
        <h1>{context.state.guessTimer}</h1>
        <div>
          <h2>Waiting for other players</h2>
          <Scores />
        </div>
      </React.Fragment>
    )}
  </PlayerContextConsumer>
);

export default Wait;
