import * as React from 'react';
import PropTypes from 'prop-types';

const Players = ({ players, nickname }) => (
  <div className="players">
    {players.map(name => (
      <div key={name}>
        {name}
        <small>{name === nickname && ' (you)'}</small>
      </div>
    ))}
  </div>
);
Players.propTypes = {
  players: PropTypes.array,
  nickname: PropTypes.string,
};

Players.defaultProps = {
  players: [],
  nickname: '',
};
export default Players;
