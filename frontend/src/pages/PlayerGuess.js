import React from 'react';
import Scores from '../components/Scores';
import Search from '../components/Search';
import { GameConsumer } from '../game-context';
import PlayerStyles from '../components/styles/PlayerStyles';

const PlayerGuess = () => (
  <GameConsumer>
    {context => (
      <PlayerStyles>
        <h1>{context.state.guessTimer}</h1>
        {!context.state.guessed ? (
          <Search title="Guess the song name" onSelectSong={context.onGuess} />
        ) : (
          <div>
            <h2>Waiting for other players</h2>
            <Scores />
          </div>
        )}
      </PlayerStyles>
    )}
  </GameConsumer>
);

export default PlayerGuess;
