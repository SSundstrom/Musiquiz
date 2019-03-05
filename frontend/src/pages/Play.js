import React from 'react';
import PropTypes from 'prop-types';
import HostMusicPlayer from './HostMusicPlayer';
import LeaderWaitingForGuesses from './LeaderWaitingForGuesses';
import PlayerGuess from './PlayerGuess';
import ShowCorrectSong from './ShowCorrectSong';
import LeaderChooseSong from './LeaderChooseSong';
import PlayerWaitingForLeader from './PlayerWaitingForLeader';

const Play = ({
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
}) => {
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
};

Play.propTypes = {
  name: PropTypes.number,
  leader: PropTypes.object,
  isHost: PropTypes.bool.isRequired,
  songToPlay: PropTypes.string,
  players: PropTypes.array,
  correctSong: PropTypes.object,

  isLeader: PropTypes.bool.isRequired,
  nickname: PropTypes.string,
  guessTimer: PropTypes.number.isRequired,
  onGuess: PropTypes.func.isRequired,
  onSaveSettings: PropTypes.func.isRequired,
  onSelectSong: PropTypes.func.isRequired,
  onKickPlayer: PropTypes.func.isRequired,
  guessed: PropTypes.bool.isRequired,
};

Play.defaultProps = {
  nickname: '',
  name: -1,
  leader: {},
  songToPlay: null,
  players: [],
  correctSong: null,
};

export default Play;
