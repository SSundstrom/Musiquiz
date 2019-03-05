import React from 'react';
import PropTypes from 'prop-types';
import JoinOrCreateRoom from './pages/JoinOrCreateRoom';
import Wait from './pages/Wait';
import Play from './pages/Play';

const Game = ({
  started,
  nickname,
  isHost,
  songToPlay,
  correctSong,
  leader,
  players,
  onSaveSettings,
  guessed,
  onKickPlayer,
  guessTimer,
  name,
  isLeader,
  onGuess,
  onSelectSong,
  onJoinAsHost,
  onJoinAsPlayer,
}) => {
  // if the game has not yet started and we have not become host or entered nickname
  if (!nickname && !isHost) {
    return <JoinOrCreateRoom onJoinAsHost={onJoinAsHost} onJoinAsPlayer={onJoinAsPlayer} />;
  }
  if (!started) {
    return <Wait isHost={isHost} name={name} nickname={nickname} players={players} />;
  }
  return (
    <Play
      name={name}
      players={players}
      isHost={isHost}
      nickname={nickname}
      guessTimer={guessTimer}
      isLeader={isLeader}
      leader={leader}
      correctSong={correctSong}
      songToPlay={songToPlay}
      guessed={guessed}
      onKickPlayer={onKickPlayer}
      onGuess={onGuess}
      onSelectSong={onSelectSong}
      onSaveSettings={onSaveSettings}
    />
  );
};

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
