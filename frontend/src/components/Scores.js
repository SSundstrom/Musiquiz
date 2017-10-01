import * as React from 'react';

const Scores = (props) => (
  <div className="scores">
      {Object.keys(props.score).map((name)=>(
        <div key={name}>
          <div>{name} - {props.score[name]}</div>
        </div>
      ))}
  </div>
);

export default Scores;