import React from 'react';

import PlayerWaitingToStart from './PlayerWaitingToStart';
import HostWaitingToStart from './HostWaitingToStart';
import { GameConsumer } from '../game-context';

const Wait = () => (
  <GameConsumer>
    {context => {
      const { isHost } = context.state;
      if (isHost) {
        return <HostWaitingToStart />;
      }
      return <PlayerWaitingToStart />;
    }}
  </GameConsumer>
);

export default Wait;
