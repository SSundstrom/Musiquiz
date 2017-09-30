import React, { Component } from 'react';

class HostWaitingToStart extends Component {
  render() {
    return (
      <div>
        Waiting for players
        <button>Start game</button>
      </div>
    );
  }
}

export default HostWaitingToStart;