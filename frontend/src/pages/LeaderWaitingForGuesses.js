import React, { Component } from 'react';

class LeaderWaitingForGuesses extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.guessTimer}</h1>
        Waiting for guesses
      </div>
    );
  }
}

export default LeaderWaitingForGuesses;