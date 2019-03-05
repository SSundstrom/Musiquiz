import React from 'react';
import PropTypes from 'prop-types';
import Scores from '../components/Scores';
import Search from '../components/Search';
import GameStyles from '../components/styles/GameStyles';

const PlayerGuess = ({ guessTimer, guessed, players, nickname, onGuess }) => (
  <GameStyles>
    <h1>{guessTimer}</h1>
    {!guessed ? (
      <Search title="Guess the song name" onSelectSong={onGuess} />
    ) : (
      <div>
        <h2>Waiting for other players</h2>
        <Scores players={players} nickname={nickname} />
      </div>
    )}
  </GameStyles>
);
PlayerGuess.propTypes = {
  guessTimer: PropTypes.number.isRequired,
  guessed: PropTypes.bool.isRequired,
  players: PropTypes.array.isRequired,
  nickname: PropTypes.string.isRequired,
  onGuess: PropTypes.func.isRequired,
};

export default PlayerGuess;
