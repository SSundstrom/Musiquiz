import React, { useContext } from 'react';
import styled from '@emotion/styled';
import FooterStyles from './styles/FooterStyles';
import Button from './styles/Button';
import { GameContext } from '../game-context';

const StartButton = styled(Button)`
  border: none;
  padding: 0;

  margin: 0;
`;

const Footer = () => {
  const context = useContext(GameContext);
  return (
    <FooterStyles>
      <StartButton type="button" onClick={() => context.onJoinAsHost()} value="Start a new game" />
      <a href="https://github.com/SSundstrom/DWIMS/issues" target="blank">
        Found an issue? Submit it here.
      </a>
    </FooterStyles>
  );
};

export default Footer;
