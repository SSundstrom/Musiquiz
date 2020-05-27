import React from 'react';
import Search from '../components/Search';
import { PlayerContextConsumer } from '../context/playerContext';

const LeaderChooseSong = () => (
  <PlayerContextConsumer>
    {context => (
      <React.Fragment>
        <h2>Pick a song</h2>
        <Search name={context.state.name} recommendations onSelectSong={context.onSelectSong} />
      </React.Fragment>
    )}
  </PlayerContextConsumer>
);

export default LeaderChooseSong;
