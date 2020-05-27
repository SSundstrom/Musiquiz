import React from 'react';
import Scores from '../components/Scores';
import Track from '../components/Track';
import { PlayerContextConsumer } from '../context/playerContext';

const GuesserWaitingForLeader = () => (
  <PlayerContextConsumer>
    {context => (
      <React.Fragment>
        <h2>{`Waiting for ${context.state.leader.nickname}`}</h2>
        {context.state.correctSong && (
          <div>
            <span>The correct song was...</span>
            <Track track={context.state.correctSong} />
          </div>
        )}
        <Scores />
      </React.Fragment>
    )}
  </PlayerContextConsumer>
);

export default GuesserWaitingForLeader;
