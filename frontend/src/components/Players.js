import * as React from 'react';

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

export default Players;
