import React, { Component } from 'react';
import JoinAsHost from './pages/JoinAsHost';
import JoinAsPlayer from './pages/JoinAsPlayer';
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
    if (!started && !nickname && !isHost) {
      return this.renderJoin();
    } 

    if (!started) {
      return this.renderWait();
    }

    return this.renderPlay();
  }

  renderWait() {
    if (this.props.isHost) {
      return (
        <HostWaitingToStart players={this.props.players} onStartGame={this.props.onStartGame} />
      );
    }

    return (
      <PlayerWaitingToStart />
    );
  }

  renderJoin() {
    if (this.props.hasHost) {
      return <JoinAsPlayer />;
    }

    return <JoinAsHost />;
  }

  renderHost() {
    if (!this.props.started) {
      return (
        <JoinAsHost />
      );
    }
  }

  renderPlay() {
    if (this.props.isHost) {
      return (
        <HostMusicPlayer />
      );
    }

    // If there is a guessing timer, we are on the guess screen
    if (this.props.guessTimer > 0) {
      if (this.props.isLeader) {
        return (
          <LeaderWaitingForGuesses />
        );
      }

      return (
        <PlayerGuess />
      );
    }

    // If guess timer is 0 and correct song is known, show score view
    if (this.props.correctSong && this.props.correctSongTimer > 0) {
      return (
        <ShowCorrectSong />
      );
    }

    if (this.props.isLeader) {
      return (
        <LeaderChooseSong />
      );
    }

    return (
      <PlayerWaitingForLeader />
    );
  }
}

export default Game;
