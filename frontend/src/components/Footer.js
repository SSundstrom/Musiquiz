/* global window */
import React, { useState, useEffect } from 'react';

import SpotifyWebApi from 'spotify-web-api-node';
import FooterStyles from './styles/FooterStyles';

const scopes = ['streaming', 'user-read-birthdate', 'user-read-email', 'user-read-private', 'user-read-playback-state', 'user-modify-playback-state'];
const Footer = () => {
  const [url, setUrl] = useState('');
  useEffect(() => {
    const api = new SpotifyWebApi({
      redirectUri: `${window.location.origin}/callback`,
      clientId: process.env.REACT_APP_CLIENT_ID,
    });
    setUrl(api.createAuthorizeURL(scopes));
  }, []);
  return (
    <FooterStyles>
      <a href={url}>Start a new game</a>
      <a href="https://github.com/SSundstrom/DWIMS/issues" target="blank">
        Found an issue? Submit it here.
      </a>
    </FooterStyles>
  );
};

export default Footer;
