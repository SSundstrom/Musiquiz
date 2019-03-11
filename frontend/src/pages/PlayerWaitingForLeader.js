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
        <div>
          {context.state.correctSong && <Track track={context.state.correctSong} />}
          <Scores />
        </div>
      </PlayerStyles>
    )}
  </GameConsumer>
);

export default PlayerWaitingForLeader;
