import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    const { isHost, name, players, onStartGame, nickname } = this.props;
    if (isHost) {
      return <HostWaitingToStart name={name} players={players} onStartGame={onStartGame} />;
    }

    return <PlayerWaitingToStart name={name} players={players} nickname={nickname} />;
  }

  renderJoin() {
    const { onJoinAsHost, onJoinAsPlayer } = this.props;
    return <JoinOrCreateRoom onJoinAsHost={onJoinAsHost} onJoinAsPlayer={onJoinAsPlayer} />;
  }

  renderPlay() {
    const {
      isHost,
      scores,
      scoreUpdates,
      songToPlay,
      correctSong,
      nickname,
      leader,
      onChangeTimer,
      guessTimer,
      name,
      isLeader,
      onGuess,
      onSelectSong,
      guessed,
    } = this.props;
    if (isHost) {
      return (
        <HostMusicPlayer
          scores={scores}
          scoreUpdates={scoreUpdates}
          songToPlay={songToPlay}
          correctSong={correctSong}
          name={name}
          onChangeTimer={onChangeTimer}
        />
      );
    }

    // If there is a guessing timer, we are on the guess screen
    if (guessTimer > 0) {
      if (isLeader) {
        return (
          <LeaderWaitingForGuesses
            scores={scores}
            scoreUpdates={scoreUpdates}
            guessTimer={guessTimer}
            nickname={nickname}
          />
        );
      }

      return (
        <PlayerGuess
          scores={scores}
          scoreUpdates={scoreUpdates}
          onGuess={onGuess}
          guessTimer={guessTimer}
          guessed={guessed}
          nickname={nickname}
        />
      );
    }

    if (isLeader) {
      return <LeaderChooseSong name={name} onSelectSong={onSelectSong} />;
    }

    // If guess timer is 0 and correct song is known, show score view
    if (correctSong) {
      return (
        <ShowCorrectSong
          scores={scores}
          scoreUpdates={scoreUpdates}
          correctSong={correctSong}
          nickname={nickname}
        />
      );
    }

    return (
      <PlayerWaitingForLeader
        leader={leader}
        nickname={nickname}
        scores={scores}
        scoreUpdates={scoreUpdates}
        correctSong={correctSong}
      />
    );
  }
}
Game.propTypes = {
  name: PropTypes.string,
  leader: PropTypes.string,
  isHost: PropTypes.bool.isRequired,
  scores: PropTypes.object,
  scoreUpdates: PropTypes.object,
  songToPlay: PropTypes.string,
  players: PropTypes.array,
  correctSong: PropTypes.bool,
  isLeader: PropTypes.bool.isRequired,
  nickname: PropTypes.string,
  guessTimer: PropTypes.number.isRequired,
  onGuess: PropTypes.func.isRequired,
  onStartGame: PropTypes.func.isRequired,
  onChangeTimer: PropTypes.func.isRequired,
  onSelectSong: PropTypes.func.isRequired,
  onJoinAsHost: PropTypes.func.isRequired,
  onJoinAsPlayer: PropTypes.func.isRequired,
  guessed: PropTypes.bool.isRequired,
};

Game.defaultProps = {
  name: '',
  nickname: '',
  leader: '',
  scores: {},
  scoreUpdates: {},
  songToPlay: null,
  players: [],
  correctSong: false,
};
export default Game;
