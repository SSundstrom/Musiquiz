import * as React from 'react';
import { GameConsumer } from '../game-context';

const Players = () => (
  <GameConsumer>
    {context =>
      context.state.players.map(player => (
        <div key={player.nickname}>
          {player.nickname}
          <small>{player.nickname === context.state.nickname && ' (you)'}</small>
        </div>
      ))
    }
  </GameConsumer>
);
export default Players;
