import React, { Component } from 'react';
import Scores from '../components/Scores'
class LeaderWaitingForGuesses extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.guessTimer}</h1>
        <h2>Waiting for guesses</h2>
        <Scores score={this.props.score} nickname={this.props.nickname} oldScore={this.props.oldScore}/>
      </div>
    );
  }
}

export default LeaderWaitingForGuesses;