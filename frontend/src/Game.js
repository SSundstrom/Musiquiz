import React, { Component } from 'react';
import JoinOrCreateRoom from './pages/JoinOrCreateRoom';
import HostWaitingToStart from './pages/HostWaitingToStart';
import PlayerWaitingToStart from './pages/PlayerWaitingToStart';
import LeaderWaitingForGuesses from './pages/LeaderWaitingForGuesses';
import PlayerGuess from './pages/PlayerGuess';
import HostMusicPlayer from './pages/HostMusicPlayer';
import LeaderChooseSong from './pages/LeaderChooseSong';
import PlayerWaitingForLeader from './pages/PlayerWaitingForLeader';
import ShowCorrectSong from './pages/ShowCorrectSong';

class Game extends Component {
  render() {
    const { started, nickname, isHost } = this.props;

    // if the game has not yet started and we have not become host or entered nickname
    if (!nickname && !isHost) {
      return this.renderJoin();
    }

    if (!started) {
      return this.renderWait();
    }

    return this.renderPlay();
  }

  renderWait() {
    const { isHost, room, onStartGame, nickname } = this.props;
    if (isHost) {
      return <HostWaitingToStart room={room} onStartGame={onStartGame} />;
    }

    return <PlayerWaitingToStart room={room} nickname={nickname} />;
  }

  renderJoin() {
    const { onJoinAsHost, onJoinAsPlayer } = this.props;
    return <JoinOrCreateRoom onJoinAsHost={onJoinAsHost} onJoinAsPlayer={onJoinAsPlayer} />;
  }

  renderPlay() {
    const {
      isHost,
      room,
      songToPlay,
      score,
      scoreUpdates,
      correctSong,
      nickname,
      onChangeTimer,
      guessTimer,
      isLeader,
      onGuess,
      onSelectSong,
      guessed,
    } = this.props;
    if (isHost) {
      return (
        <HostMusicPlayer
          room={room}
          songToPlay={songToPlay}
          score={score}
          scoreUpdates={scoreUpdates}
          correctSong={correctSong}
          nickname={nickname}
          onChangeTimer={onChangeTimer}
        />
      );
    }

    // If there is a guessing timer, we are on the guess screen
    if (guessTimer > 0) {
      if (isLeader) {
        return (
          <LeaderWaitingForGuesses
            room={room}
            guessTimer={guessTimer}
            score={score}
            scoreUpdates={scoreUpdates}
            nickname={nickname}
          />
        );
      }

      return (
        <PlayerGuess
          onGuess={onGuess}
          guessTimer={guessTimer}
          guessed={guessed}
          score={score}
          scoreUpdates={scoreUpdates}
          nickname={nickname}
        />
      );
    }

    if (isLeader) {
      return <LeaderChooseSong onSelectSong={onSelectSong} />;
    }

    // If guess timer is 0 and correct song is known, show score view
    if (correctSong) {
      return (
        <ShowCorrectSong
          room={room}
          score={score}
          scoreUpdates={scoreUpdates}
          correctSong={correctSong}
          nickname={nickname}
        />
      );
    }

    return (
      <PlayerWaitingForLeader
        room={room}
        score={score}
        nickname={nickname}
        correctSong={correctSong}
      />
    );
  }
}

export default Game;
