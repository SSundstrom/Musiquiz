import React from 'react';
import Scores from '../../components/Scores';
import Track from '../../components/Track';
import { GameConsumer } from '../../game-context';

const ShowCorrectSong = () => (
  <GameConsumer>
    {context => (
      <React.Fragment>
        <div>
          <span>The correct song was...</span>
          <Track track={context.state.correctSong} />
          <Scores />
        </div>
      </React.Fragment>
    )}
  </GameConsumer>
);

export default ShowCorrectSong;
