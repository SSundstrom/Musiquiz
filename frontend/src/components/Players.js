import * as React from 'react';
import { PlayerContextConsumer } from '../context/playerContext';

const Players = () => (
  <PlayerContextConsumer>
    {context =>
      context.state.players.map(player => (
        <div key={player.nickname}>
          {player.nickname}
          <small>{player.nickname === context.state.nickname && ' (you)'}</small>
        </div>
      ))
    }
  </PlayerContextConsumer>
);
export default Players;
