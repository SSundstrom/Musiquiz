import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';
import { Route, Switch, Redirect } from 'react-router-dom';
import Guess from './Guess';
import Pick from './Pick';
import Picked from './Picked';
import Wait from './Wait';
import IconButton from '../components/styles/IconButton';
import ContentStyles from '../components/styles/ContentStyles';
import { GameContext } from '../game-context';

const PlayerHeader = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;
const Player = ({ match }) => {
  const context = useContext(GameContext);
  return (
    <ContentStyles>
      <PlayerHeader>
        <IconButton value="Leave Game" onClick={() => context.leave()}>
          <FontAwesomeIcon icon="sign-out-alt" />
        </IconButton>
      </PlayerHeader>
      <Switch>
        <Route path={`${match.path}/wait`} component={Wait} />
        <Route path={`${match.path}/guess`} component={Guess} />
        <Route path={`${match.path}/guessed`} component={Guess} />
        <Route path={`${match.path}/pick`} component={Pick} />
        <Route path={`${match.path}/picked`} component={Picked} />
        <Redirect to="/" />
      </Switch>
    </ContentStyles>
  );
};
Player.propTypes = {
  match: PropTypes.object.isRequired,
};
export default Player;
