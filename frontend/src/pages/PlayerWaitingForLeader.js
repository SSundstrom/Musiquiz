import React from 'react';
import Scores from '../components/Scores';
import Track from '../components/Track';
import GameStyles from '../components/styles/GameStyles';
import { GameConsumer } from '../game-context';

const PlayerWaitingForLeader = () => (
  <GameConsumer>
    {context => (
      <GameStyles>
        <h2>{`Waiting for ${context.state.leader.nickname} to choose a song`}</h2>
        <div>
          {context.state.correctSong && <Track track={context.state.correctSong} />}
          <Scores />
        </div>
      </GameStyles>
    )}
  </GameConsumer>
);

export default PlayerWaitingForLeader;
