import * as React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import ContentStyles from './styles/ContentStyles';
import { GameConsumer } from '../game-context';

const Background = styled.div`
  position: relative;
  background-color: ${({ isLeader, isHost, theme }) => {
    if (isLeader) {
      return theme.leader;
    }
    if (isHost) {
      return theme.host;
    }
    return theme.default;
  }};
  height: auto;
  min-height: 100%;
  padding-top: 50px;
`;

const Layout = ({ children }) => (
  <GameConsumer>
    {context => (
      <Background isLeader={context.state.isLeader} isHost={context.state.isHost}>
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
