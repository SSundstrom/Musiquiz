import React from 'react';
import Players from '../components/Players';
import GameStyles from '../components/styles/GameStyles';
import { GameConsumer } from '../game-context';

const HostWaitingToStart = () => (
  <GameConsumer>
    {context => (
      <GameStyles>
        <h2>Waiting for more players</h2>
        <h2>{`Room code: ${context.state.name}`}</h2>
        <Players />
      </GameStyles>
    )}
  </GameConsumer>
);

export default HostWaitingToStart;
