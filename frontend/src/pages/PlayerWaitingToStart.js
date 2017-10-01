import React, { Component } from 'react';
import Players from '../components/Players'

class PlayerWaitingToStart extends Component {
  render() {
    return (
      <div>
        <h2>Waiting for host to start</h2>
        <Players players={this.props.players} nickname={this.props.nickname} />
      </div>
    );
  }
}

export default PlayerWaitingToStart;