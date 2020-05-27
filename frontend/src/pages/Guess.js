import React from 'react';
import Search from '../components/Search';
import { PlayerContextConsumer } from '../context/playerContext';

const Guess = () => (
  <PlayerContextConsumer>
    {context => (
      <React.Fragment>
        <h1>{context.state.guessTimer}</h1>
        <Search title="Guess the song" onSelectSong={context.onGuess} />
      </React.Fragment>
    )}
  </PlayerContextConsumer>
);

export default Guess;
