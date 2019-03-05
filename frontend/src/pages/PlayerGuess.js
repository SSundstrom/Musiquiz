import React from 'react';
import Scores from '../components/Scores';
import Search from '../components/Search';
import GameStyles from '../components/styles/GameStyles';
import { GameConsumer } from '../game-context';

const PlayerGuess = () => (
  <GameConsumer>
    {context => (
      <GameStyles>
        <h1>{context.state.guessTimer}</h1>
        {!context.state.guessed ? (
          <Search title="Guess the song name" onSelectSong={context.onGuess} />
        ) : (
          <div>
            <h2>Waiting for other players</h2>
            <Scores />
          </div>
        )}
      </GameStyles>
    )}
  </GameConsumer>
);

export default PlayerGuess;
