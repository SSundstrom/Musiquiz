import React from 'react';
import Scores from '../../components/Scores';
import Search from '../../components/Search';
import { GameConsumer } from '../../game-context';

const Guess = () => (
  <GameConsumer>
    {context => (
      <React.Fragment>
        <h1>{context.state.guessTimer}</h1>
        {!context.state.guessed ? (
          <Search title="Guess the song" onSelectSong={context.onGuess} />
        ) : (
          <div>
            <h2>Waiting for other players</h2>
            <Scores />
          </div>
        )}
      </React.Fragment>
    )}
  </GameConsumer>
);

export default Guess;
