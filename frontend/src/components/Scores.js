import * as React from 'react';


const Scores = (props) => (
  <div className="scores">
      {Object.keys(props.score).map((name)=>(
          <div>
            <div>{name}</div>
            <div>{props.score[name]}</div>
        </div>
      ))}
  </div>
);

export default Scores;