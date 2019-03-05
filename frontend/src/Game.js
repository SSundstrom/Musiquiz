import React from 'react';
import JoinOrCreateRoom from './pages/JoinOrCreateRoom';
import { GameConsumer } from './game-context';
import Wait from './pages/Wait';
import Play from './pages/Play';

const Game = () => (
  <GameConsumer>
    {context => {
      const { nickname, isHost, started } = context.state;
      if (!nickname && !isHost) {
        return <JoinOrCreateRoom />;
      }
      if (!started) {
        return <Wait />;
      }
      return <Play />;
    }}
  </GameConsumer>
);

export default Game;
