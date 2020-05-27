import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import ContentStyles from '../components/styles/ContentStyles';
import IconButton from '../components/styles/IconButton';
import usePlayer from '../hooks/usePlayer';
import Guess from './Guess';
import Pick from './Pick';
import Picked from './Picked';
import Wait from './Wait';

const PlayerHeader = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const Player = ({ match }) => {
  const player = usePlayer();
  if (!player.state.name) {
    return <Redirect to="/" />;
  }

  return (
    <ContentStyles>
      <PlayerHeader>
        <IconButton value="Leave Game" onClick={() => player.leave()}>
          <FontAwesomeIcon icon="sign-out-alt" />
        </IconButton>
      </PlayerHeader>

      <Switch>
        <Route path={`${match.path}/wait`} component={Wait} />
        <Route path={`${match.path}/guess`} component={Guess} />
        <Route path={`${match.path}/guessed`} component={Guess} />
        <Route path={`${match.path}/pick`} component={Pick} />
        <Route path={`${match.path}/picked`} component={Picked} />
      </Switch>
    </ContentStyles>
  );
};
Player.propTypes = {
  match: PropTypes.object.isRequired,
};
export default Player;
