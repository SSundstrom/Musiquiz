import React from 'react';
import Scores from '../components/Scores';
import Track from '../components/Track';
import GameStyles from '../components/styles/GameStyles';
import { GameConsumer } from '../game-context';

const ShowCorrectSong = () => (
  <GameConsumer>
    {context => (
      <GameStyles>
        <h2>Correct song was</h2>
        <div>
          <Track track={context.state.correctSong} />
          <Scores />
        </div>
      </GameStyles>
    )}
  </GameConsumer>
);

export default ShowCorrectSong;
