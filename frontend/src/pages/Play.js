import React from 'react';
import LogRocket from 'logrocket';
import LeaderWaitingForGuesses from './LeaderWaitingForGuesses';
import PlayerGuess from './PlayerGuess';
import ShowCorrectSong from './ShowCorrectSong';
import LeaderChooseSong from './LeaderChooseSong';
import PlayerWaitingForLeader from './PlayerWaitingForLeader';
import { GameConsumer } from '../game-context';
import HostScreen from './HostScreen';

const Play = () => (
  <GameConsumer>
    {context => {
      const { isHost, gamestate, isLeader } = context.state;
      if (isHost) {
        LogRocket.identify('Host', {});
        return <HostScreen />;
      }
      LogRocket.identify('Player', {});

      if (gamestate === 'midgame') {
        if (isLeader) {
          return <LeaderWaitingForGuesses />;
        }
        return <PlayerGuess />;
      }

      // If guess timer is 0 and correct song is known, show score view
      if (gamestate === 'finished') {
        return <ShowCorrectSong />;
      }
      if (gamestate === 'choose') {
        if (isLeader) {
          return <LeaderChooseSong />;
        }
        return <PlayerWaitingForLeader />;
      }
      return (
        <div>
          <h1>Error...</h1>
          <h2> Please refresh page</h2>
        </div>
      );
    }}
  </GameConsumer>
);

export default Play;
