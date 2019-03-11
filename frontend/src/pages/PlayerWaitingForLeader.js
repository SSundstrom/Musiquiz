import React from 'react';
import Scores from '../components/Scores';
import Track from '../components/Track';
import { GameConsumer } from '../game-context';
import PlayerStyles from '../components/styles/PlayerStyles';

const PlayerWaitingForLeader = () => (
  <GameConsumer>
    {context => (
      <PlayerStyles>
        <h2>{`Waiting for ${context.state.leader.nickname} to choose a song`}</h2>
        {context.state.correctSong && (
          <div>
            <h2>The correct song was...</h2>
            <Track track={context.state.correctSong} />
          </div>
        )}
        <Scores />
      </PlayerStyles>
    )}
  </GameConsumer>
);

export default PlayerWaitingForLeader;
