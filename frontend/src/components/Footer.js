import React from 'react';
import { auth } from '../playback';
import FooterStyles from './styles/FooterStyles';

const Footer = () => {
  return (
    <FooterStyles>
      <a onClick={() => auth()}>Start a new game</a>
      <a href="https://github.com/SSundstrom/DWIMS/issues" target="blank">
        Found an issue? Submit it here.
      </a>
    </FooterStyles>
  );
};

export default Footer;
