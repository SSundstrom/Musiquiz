import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Scores from '../components/Scores';
import Track from '../components/Track';

const ShowCorrectSong = ({ correctSong, scores, scoreUpdates, nickname }) => (
  <div>
    <h2>Correct song was</h2>
    <div>
      <Track track={correctSong} />
      <Scores scores={scores} nickname={nickname} scoreUpdates={scoreUpdates} />
    </div>
  </div>
);

ShowCorrectSong.propTypes = {
  correctSong: PropTypes.object.isRequired,
  scores: PropTypes.object.isRequired,
  scoreUpdates: PropTypes.object.isRequired,
  nickname: PropTypes.string.isRequired,
};
export default ShowCorrectSong;
