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
                {(name in this.props.score ) && this.props.score[name] && this.props.score[name]} 
                {(name in this.props.scoreUpdates) && ' + ' + this.props.scoreUpdates[name]}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  getDiff(name) {
    if (!this.props.oldScore) {
      return '0';
    }

    if (!this.props.oldScore[name]) {
      return ' + ' + this.props.score[name];
    }

    const diff = this.props.score[name] - this.props.oldScore[name];

    return '+ ' + diff;
  }
}

export default Scores;