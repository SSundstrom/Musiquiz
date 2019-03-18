import React from 'react';
import JoinOrCreateRoom from './pages/JoinOrCreateRoom';
import { GameConsumer } from './game-context';
import Play from './pages/Play';

const Game = () => (
  <GameConsumer>
    {context => {
      const { joined } = context.state;
      if (!joined) {
        return <JoinOrCreateRoom />;
      }
      return <Play />;
    }}
  </GameConsumer>
);

export default Game;
