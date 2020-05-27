import React from 'react';
import PropTypes from 'prop-types';
import { PlayerContextConsumer } from '../context/playerContext';
import BackgroundStyles from './styles/BackgroundStyles';

const Background = ({ children }) => {
  return (
    <PlayerContextConsumer>
      {context => (
        <BackgroundStyles
          isLeader={context.state.isLeader}
          isHost={context.state.isHost}
          started={context.state.started}
          correct={context.state.correct}
          guessed={context.state.guessed}
        >
          {children}
        </BackgroundStyles>
      )}
    </PlayerContextConsumer>
  );
};
Background.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};
Background.defaultProps = {
  children: null,
};
export default Background;
