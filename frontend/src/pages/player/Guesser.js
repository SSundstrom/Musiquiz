import React from 'react';
import Guess from './Guess';
import ShowCorrectSong from './ShowCorrectSong';
import GuesserWaitingForLeader from './GuesserWaitingForLeader';
import { GameConsumer } from '../../game-context';
import Error from '../../components/Error';

const Guesser = () => (
  <GameConsumer>
    {context => {
      const { gamestate } = context.state;
      if (gamestate === 'midgame') {
        return <Guess />;
      }
      if (gamestate === 'finished') {
        return <ShowCorrectSong />;
      }
      if (gamestate === 'choose') {
        return <GuesserWaitingForLeader />;
      }
      return <Error />;
    }}
  </GameConsumer>
);

export default Guesser;
