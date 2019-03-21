import React from 'react';
import Search from '../components/Search';
import { GameConsumer } from '../game-context';

const Guess = () => (
  <GameConsumer>
    {context => (
      <React.Fragment>
        <h1>{context.state.guessTimer}</h1>
        <Search title="Guess the song" onSelectSong={context.onGuess} />
      </React.Fragment>
    )}
  </GameConsumer>
);

export default Guess;
