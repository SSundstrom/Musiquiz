import * as React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import ContentStyles from './styles/ContentStyles';
import { GameConsumer } from '../game-context';

const Background = styled.div`
  position: relative;
  background-color: ${({ isLeader, guessed, correct, theme }) => {
    if (isLeader) {
      return theme.purple;
    }
    if (guessed) {
      if (correct) {
        return theme.green;
      }
      return theme.red;
    }
    return theme.blue;
  }};
  height: auto;
  min-height: 100%;
  padding-top: 50px;
  @keyframes bgcolor {
    0% {
      background-color: ${({ theme }) => theme.blue};
    }
    17% {
      background-color: ${({ theme }) => theme.teal};
    }
    34% {
      background-color: ${({ theme }) => theme.green};
    }
    51% {
      background-color: ${({ theme }) => theme.yellow};
    }
    67% {
      background-color: ${({ theme }) => theme.orange};
    }
    84% {
      background-color: ${({ theme }) => theme.red};
    }
    100% {
      background-color: ${({ theme }) => theme.purple};
    }
  }
  ${({ isHost, started }) => {
    if (isHost || !started) {
      return `animation: bgcolor 20s infinite;
              animation-direction: alternate;`;
    }
    return '';
  }}
`;

const Layout = ({ children }) => (
  <GameConsumer>
    {context => (
      <Background
        isLeader={context.state.isLeader}
        isHost={context.state.isHost}
        started={context.state.started}
        correct={context.state.correct}
        guessed={context.state.guessed}
      >
        <ContentStyles>{children}</ContentStyles>
      </Background>
    )}
  </GameConsumer>
);
Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};
Layout.defaultProps = {
  children: null,
};
export default Layout;
