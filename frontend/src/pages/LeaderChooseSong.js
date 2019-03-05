import React from 'react';
import Search from '../components/Search';
import GameStyles from '../components/styles/GameStyles';
import { GameConsumer } from '../game-context';

const LeaderChooseSong = () => (
  <GameConsumer>
    {context => (
      <GameStyles>
        <h2>Dude, enter a song name</h2>
        <Search name={context.state.name} recommendations onSelectSong={context.onSelectSong} />
      </GameStyles>
    )}
  </GameConsumer>
);

export default LeaderChooseSong;
