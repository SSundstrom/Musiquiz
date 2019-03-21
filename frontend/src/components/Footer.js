import React from 'react';
import styled from '@emotion/styled';
import FooterStyles from './styles/FooterStyles';
import { auth } from '../playback';
import Button from './styles/Button';

const StartButton = styled(Button)`
  border: none;
  padding: 0;
  margin: 0;
`;
const Footer = () => {
  return (
    <FooterStyles>
      <StartButton type="button" onClick={() => auth()} value="Start a new game" />
      <a href="https://github.com/SSundstrom/DWIMS/issues" target="blank">
        Found an issue? Submit it here.
      </a>
    </FooterStyles>
  );
};

export default Footer;
