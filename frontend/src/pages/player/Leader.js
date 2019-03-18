import React from 'react';
import LeaderWaitingForGuessers from './LeaderWaitingForGuessers';
import ShowCorrectSong from './ShowCorrectSong';
import LeaderChooseSong from './LeaderChooseSong';
import { GameConsumer } from '../../game-context';
import Error from '../../components/Error';

const Leader = () => (
  <GameConsumer>
    {context => {
      const { gamestate, guessTimer } = context.state;
      if (gamestate === 'midgame') {
        return <LeaderWaitingForGuessers guessTimer={guessTimer} />;
      }
      if (gamestate === 'finished') {
        return <ShowCorrectSong />;
      }
      if (gamestate === 'choose') {
        return <LeaderChooseSong />;
      }
      return <Error />;
    }}
  </GameConsumer>
);

export default Leader;
