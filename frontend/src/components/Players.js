import * as React from 'react';


const Players = (props) => (
  <div className="players">
      {props.players.map((name)=>(
        <div>
            {name}
        </div>
      ))}
  </div>
);

export default Players;