import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connectToSpotify } from '../api';
import ContentStyles from '../components/styles/ContentStyles';

const Player = ({ location }) => {
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    const code = location.search.split('=')[1];
    connectToSpotify(code, res => {
      setSuccess(res.success);
    });
  }, []);

  return success ? <Redirect to="/host" /> : <ContentStyles>Loading</ContentStyles>;
};
Player.propTypes = {
  location: PropTypes.object.isRequired,
};
export default Player;
