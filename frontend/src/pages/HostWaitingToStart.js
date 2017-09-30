import React, { Component } from 'react';

class HostWaitingToStart extends Component {
  render() {
    return (
      <div>
        Waiting for players
        {!this.props.players.length && <button onClick={() => this.props.onStartGame()}>Start game</button>}
      </div>
    );
  }
}

export default HostWaitingToStart;