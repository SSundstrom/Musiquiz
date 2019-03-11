import React from 'react';
import Scores from '../components/Scores';
import Track from '../components/Track';
import { GameConsumer } from '../game-context';
import PlayerStyles from '../components/styles/PlayerStyles';

const ShowCorrectSong = () => (
  <GameConsumer>
    {context => (
      <PlayerStyles>
        <div>
          <span>The correct song was...</span>
          <Track track={context.state.correctSong} />
          <Scores />
        </div>
      </PlayerStyles>
    )}
  </GameConsumer>
);

export default ShowCorrectSong;
