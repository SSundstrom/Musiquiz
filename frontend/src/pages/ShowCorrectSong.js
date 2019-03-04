import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Scores from '../components/Scores';
import Track from '../components/Track';

const ShowCorrectSong = ({ correctSong, players, nickname }) => (
  <div>
    <h2>Correct song was</h2>
    <div>
      <Track track={correctSong} />
      <Scores players={players} nickname={nickname} />
    </div>
  </div>
);

ShowCorrectSong.propTypes = {
  correctSong: PropTypes.object.isRequired,
  players: PropTypes.array.isRequired,
  nickname: PropTypes.string.isRequired,
};
export default ShowCorrectSong;
