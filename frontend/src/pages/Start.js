import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connectToSpotify } from '../api';
import ContentStyles from '../components/styles/ContentStyles';

const Player = ({ location }) => {
  useEffect(() => {
    const code = location.search.split('=')[1];
    connectToSpotify(code, res => {
      console.log(res);
    });
  }, []);
  return <ContentStyles>Loading</ContentStyles>;
};
Player.propTypes = {
  location: PropTypes.object.isRequired,
};
export default Player;
