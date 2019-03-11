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
      const { isHost, correctSong, guessTimer, isLeader } = context.state;
      if (isHost) {
        LogRocket.identify('Host', {});
        return <HostScreen />;
      }
      LogRocket.identify('Player', {});
      // If there is a guessing timer, we are on the guess screen
      if (guessTimer > 0) {
        if (isLeader) {
          return <LeaderWaitingForGuesses />;
        }

        return <PlayerGuess />;
      }

      // If guess timer is 0 and correct song is known, show score view
      if (correctSong) {
        return <ShowCorrectSong />;
      }

      if (isLeader) {
        return <LeaderChooseSong />;
      }

      return <PlayerWaitingForLeader />;
    }}
  </GameConsumer>
);

export default Play;
