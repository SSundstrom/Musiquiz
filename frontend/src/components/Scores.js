import * as React from 'react';

class Scores extends React.Component {
  render() {
    return (
      <div className="scores">
        {Object.keys(this.props.score).sort((a, b) => this.props.score[b]-this.props.score[a]).map((name) => (
          <div key={name}>
            <div className="score-row">
              <div className="score-name">
                {name}
                <small>{name === this.props.nickname && ' (you)'}</small>
              </div>
              <div className="score-score">
                {this.props.score[name]}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Scores;