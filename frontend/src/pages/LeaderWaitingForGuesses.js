import React, { Component } from 'react';

class LeaderWaitingForGuesses extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.guessTimer}</h1>
        <h2>Waiting for guesses</h2>
      </div>
    );
  }
}

export default LeaderWaitingForGuesses;