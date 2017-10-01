import React, { Component } from 'react';

class PlayerWaitingForLeader extends Component {
  render() {
    return (
      <div>
        <h2>Waiting for {this.props.leader} to choose song</h2>
      </div>
    );
  }
}

export default PlayerWaitingForLeader;