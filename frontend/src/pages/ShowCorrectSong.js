import React from 'react';
import Scores from '../components/Scores';
import Track from '../components/Track';
import { GameConsumer } from '../game-context';
import PlayerStyles from '../components/styles/PlayerStyles';

const ShowCorrectSong = () => (
  <GameConsumer>
    {context => (
      <PlayerStyles>
        <h2>The correct song was...</h2>
        <div>
          <Track track={context.state.correctSong} />
          <Scores />
        </div>
      </PlayerStyles>
    )}
  </GameConsumer>
);

export default ShowCorrectSong;
