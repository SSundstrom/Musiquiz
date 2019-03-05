import React from 'react';
import PropTypes from 'prop-types';
import Search from '../components/Search';

const LeaderChooseSong = ({ onSelectSong, name }) => (
  <div className="game">
    <h2>Dude, enter a song name</h2>
    <Search name={name} recommendations onSelectSong={onSelectSong} />
  </div>
);

LeaderChooseSong.propTypes = {
  onSelectSong: PropTypes.func.isRequired,
  name: PropTypes.number.isRequired,
};

export default LeaderChooseSong;
