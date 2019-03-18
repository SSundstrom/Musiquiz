import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';
import Guesser from './Guesser';
import Leader from './Leader';
import IconButton from '../../components/styles/IconButton';
import ContentStyles from '../../components/styles/ContentStyles';
import { GameContext } from '../../game-context';

const PlayerHeader = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;
const PlayerScreen = ({ isLeader, gamestate }) => {
  const context = useContext(GameContext);
  let content;
  if (isLeader) {
    content = <Leader gamestate={gamestate} />;
  } else {
    content = <Guesser gamestate={gamestate} />;
  }
  return (
    <ContentStyles>
      <PlayerHeader>
        <IconButton value="Leave Game" onClick={() => context.leave()}>
          <FontAwesomeIcon icon="sign-out-alt" />
        </IconButton>
      </PlayerHeader>
      {content}
    </ContentStyles>
  );
};
PlayerScreen.propTypes = {
  isLeader: PropTypes.bool.isRequired,
  gamestate: PropTypes.string.isRequired,
};
export default PlayerScreen;
