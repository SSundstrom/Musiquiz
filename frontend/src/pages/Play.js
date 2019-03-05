import React from 'react';
import HostMusicPlayer from './HostMusicPlayer';
import LeaderWaitingForGuesses from './LeaderWaitingForGuesses';
import PlayerGuess from './PlayerGuess';
import ShowCorrectSong from './ShowCorrectSong';
import LeaderChooseSong from './LeaderChooseSong';
import PlayerWaitingForLeader from './PlayerWaitingForLeader';
import { GameConsumer } from '../game-context';

const Play = () => (
  <GameConsumer>
    {context => {
      const { isHost, correctSong, guessTimer, isLeader, songToPlay } = context.state;
      if (isHost) {
        return <HostMusicPlayer songToPlay={songToPlay} />;
      }

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
