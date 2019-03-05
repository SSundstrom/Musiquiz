import React from 'react';
import PropTypes from 'prop-types';
import Scores from '../components/Scores';
import Track from '../components/Track';
import GameStyles from '../components/styles/GameStyles';

const ShowCorrectSong = ({ correctSong, players, nickname }) => (
  <GameStyles>
    <h2>Correct song was</h2>
    <div>
      <Track track={correctSong} />
      <Scores players={players} nickname={nickname} />
    </div>
  </GameStyles>
);

ShowCorrectSong.propTypes = {
  correctSong: PropTypes.object.isRequired,
  players: PropTypes.array.isRequired,
  nickname: PropTypes.string.isRequired,
};
export default ShowCorrectSong;
