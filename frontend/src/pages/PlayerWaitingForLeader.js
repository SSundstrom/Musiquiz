import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Scores from '../components/Scores';
import Track from '../components/Track';

const PlayerWaitingForLeader = ({ correctSong, leader, nickname, scores, scoreUpdates }) => (
  <div>
    <h2>{`Waiting for ${leader} to choose a song`}</h2>
    <div>
      {correctSong && <Track track={correctSong} />}
      {scores && <Scores scores={scores} nickname={nickname} scoreUpdates={scoreUpdates} />}
    </div>
  </div>
);
PlayerWaitingForLeader.propTypes = {
  correctSong: PropTypes.bool.isRequired,
  leader: PropTypes.string.isRequired,
  nickname: PropTypes.string.isRequired,
  scores: PropTypes.object.isRequired,
  scoreUpdates: PropTypes.object.isRequired,
};
export default PlayerWaitingForLeader;
