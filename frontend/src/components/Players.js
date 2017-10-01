import * as React from 'react';

const Players = (props) => (
  <div className="players">
      {props.players.map((name)=>(
        <div key={name}>
            {name}
            <small>{name === props.nickname && ' (you)'}</small>
        </div>
      ))}
  </div>
);

export default Players;