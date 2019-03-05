import React from 'react';
import PropTypes from 'prop-types';
import Search from '../components/Search';
import GameStyles from '../components/styles/GameStyles';

const LeaderChooseSong = ({ onSelectSong, name }) => (
  <GameStyles>
    <h2>Dude, enter a song name</h2>
    <Search name={name} recommendations onSelectSong={onSelectSong} />
  </GameStyles>
);

LeaderChooseSong.propTypes = {
  onSelectSong: PropTypes.func.isRequired,
  name: PropTypes.number.isRequired,
};

export default LeaderChooseSong;
