import React from 'react';
import Search from '../components/Search';
import { GameConsumer } from '../game-context';
import PlayerStyles from '../components/styles/PlayerStyles';

const LeaderChooseSong = () => (
  <GameConsumer>
    {context => (
      <PlayerStyles>
        <h2>Pick a song</h2>
        <Search name={context.state.name} recommendations onSelectSong={context.onSelectSong} />
      </PlayerStyles>
    )}
  </GameConsumer>
);

export default LeaderChooseSong;
