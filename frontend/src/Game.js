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
  renderWait() {
    const { isHost, name, players, nickname } = this.props;
    if (isHost) {
      return <HostWaitingToStart name={name} players={players} />;
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
      songToPlay,
      correctSong,
      nickname,
      leader,
      players,
      onSaveSettings,
      onKickPlayer,
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
          players={players}
          songToPlay={songToPlay}
          correctSong={correctSong}
          name={name}
          onSaveSettings={onSaveSettings}
          onKickPlayer={onKickPlayer}
        />
      );
    }

    // If there is a guessing timer, we are on the guess screen
    if (guessTimer > 0) {
      if (isLeader) {
        return <LeaderWaitingForGuesses players={players} guessTimer={guessTimer} nickname={nickname} />;
      }

      return <PlayerGuess players={players} onGuess={onGuess} guessTimer={guessTimer} guessed={guessed} nickname={nickname} />;
    }

    // If guess timer is 0 and correct song is known, show score view
    if (correctSong) {
      return <ShowCorrectSong players={players} correctSong={correctSong} nickname={nickname} />;
    }

    if (isLeader) {
      return <LeaderChooseSong name={name} onSelectSong={onSelectSong} />;
    }

    return <PlayerWaitingForLeader leader={leader.nickname} nickname={nickname} players={players} correctSong={correctSong} />;
  }

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
}
Game.propTypes = {
  name: PropTypes.number,
  leader: PropTypes.object,
  isHost: PropTypes.bool.isRequired,
  songToPlay: PropTypes.string,
  players: PropTypes.array,
  correctSong: PropTypes.object,
  started: PropTypes.bool.isRequired,
  isLeader: PropTypes.bool.isRequired,
  nickname: PropTypes.string,
  guessTimer: PropTypes.number.isRequired,
  onGuess: PropTypes.func.isRequired,
  onSaveSettings: PropTypes.func.isRequired,
  onSelectSong: PropTypes.func.isRequired,
  onKickPlayer: PropTypes.func.isRequired,
  onJoinAsHost: PropTypes.func.isRequired,
  onJoinAsPlayer: PropTypes.func.isRequired,
  guessed: PropTypes.bool.isRequired,
};

Game.defaultProps = {
  nickname: '',
  name: -1,
  leader: {},
  songToPlay: null,
  players: [],
  correctSong: null,
};
export default Game;
