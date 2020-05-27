import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import LoadingSpinner from '../components/LoadingSpinner';
import ContentStyles from '../components/styles/ContentStyles';
import SpotifyPlayer from '../playback';

const SpinnerWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const Start = ({ location }) => {
  const [success, setSuccess] = useState(false);
  const waitForWebPlayer = () => {
    if (SpotifyPlayer.device_id) {
      setSuccess(true);
    } else {
      setTimeout(waitForWebPlayer, 100);
    }
  };
  useEffect(() => {
    const code = location.hash
      .substring(1)
      .split('&')
      .reduce((initial, item) => {
        if (item) {
          const parts = item.split('=');
          initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
      }, {});
    SpotifyPlayer.access_token = code.access_token;
    waitForWebPlayer();
  }, [location]);

  return success ? (
    <Redirect to="/host" />
  ) : (
    <ContentStyles>
      <SpinnerWrapper>
        <LoadingSpinner />
      </SpinnerWrapper>
    </ContentStyles>
  );
};
Start.propTypes = {
  location: PropTypes.object.isRequired,
};
export default Start;
