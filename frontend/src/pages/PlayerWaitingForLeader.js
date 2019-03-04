import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Scores from '../components/Scores';
import Track from '../components/Track';

const PlayerWaitingForLeader = ({ correctSong, leader, nickname, players }) => (
  <div className="game">
    <h2>{`Waiting for ${leader} to choose a song`}</h2>
    <div>
      {correctSong && <Track track={correctSong} />}
      {players && <Scores nickname={nickname} players={players} />}
    </div>
  </div>
);
PlayerWaitingForLeader.propTypes = {
  correctSong: PropTypes.bool.isRequired,
  leader: PropTypes.string.isRequired,
  nickname: PropTypes.string.isRequired,
  players: PropTypes.array.isRequired,
};
export default PlayerWaitingForLeader;
