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
    if (!nickname && !isHost) {
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
        <HostWaitingToStart 
          players={this.props.players} 
          onStartGame={this.props.onStartGame} 
        />
      );
    }

    return (
      <PlayerWaitingToStart 
        players={this.props.players}
        nickname={this.props.nickname}
      />
    );
  }

  renderJoin() {
    if (this.props.hasHost) {
      return (
        <JoinAsPlayer 
          onJoinAsPlayer={this.props.onJoinAsPlayer}
          players={this.props.players}
        />
      );
    }

    return (
      <JoinAsHost 
        onJoinAsHost={this.props.onJoinAsHost}
      />
    );
  }

  renderPlay() {
    if (this.props.isHost) {
      return (
        <HostMusicPlayer 
          songToPlay={this.props.songToPlay}
          score={this.props.score}
          oldScore={this.props.oldScore}
          correctSong={this.props.correctSong}
          nickname={this.props.nickname}
          onChangeTimer={this.props.onChangeTimer}
        />
      );
    }

    // If there is a guessing timer, we are on the guess screen
    if (this.props.guessTimer > 0) {
      if (this.props.isLeader) {
        return (
          <LeaderWaitingForGuesses
            players={this.props.players}
            guessTimer={this.props.guessTimer}
            score={this.props.score}
            oldScore={this.props.oldScore}
            nickname={this.props.nickname}
          />
        );
      }

      return (
        <PlayerGuess 
          onGuess={this.props.onGuess}
          guessTimer={this.props.guessTimer}
          guessed={this.props.guessed}
          score={this.props.score}
          oldScore={this.props.oldScore}
          nickname={this.props.nickname}
        />
      );
    }

    // If guess timer is 0 and correct song is known, show score view
    if (this.props.correctSong && this.props.correctSongTimer > 0) {
      return (
        <ShowCorrectSong 
          players={this.props.players}
          score={this.props.score}
          oldScore={this.props.oldScore}
          correctSong={this.props.correctSong}
          nickname={this.props.nickname}
        />
      );
    }

    if (this.props.isLeader) {
      return (
        <LeaderChooseSong 
          onSelectSong={this.props.onSelectSong}
        />
      );
    }

    return (
      <PlayerWaitingForLeader
        players={this.props.players}
        score={this.props.score}
        leader={this.props.leader}
        nickname={this.props.nickname}
        oldScore={this.props.oldScore}
        correctSong={this.props.correctSong}
      />
    );
  }
}

export default Game;
