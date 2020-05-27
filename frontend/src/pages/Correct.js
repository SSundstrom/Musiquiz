import React from 'react';
import Scores from '../components/Scores';
import Track from '../components/Track';
import { PlayerContextConsumer } from '../context/playerContext';

const ShowCorrectSong = () => (
  <PlayerContextConsumer>
    {context => (
      <React.Fragment>
        <div>
          <span>The correct song was...</span>
          <Track track={context.state.correctSong} />
          <Scores />
        </div>
      </React.Fragment>
    )}
  </PlayerContextConsumer>
);

export default ShowCorrectSong;
