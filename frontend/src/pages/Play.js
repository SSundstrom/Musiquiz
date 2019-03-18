import React from 'react';
import { GameConsumer } from '../game-context';
import PlayerScreen from './player/PlayerScreen';
import HostScreen from './host/HostScreen';

const Play = () => (
  <GameConsumer>
    {context => {
      const { isHost, started, isLeader, gamestate } = context.state;
      if (isHost) {
        return <HostScreen started={started} />;
      }
      return <PlayerScreen isLeader={isLeader} gamestate={gamestate} />;
    }}
  </GameConsumer>
);

export default Play;
