import React, { Component } from 'react';
import Players from '../components/Players'

class PlayerWaitingToStart extends Component {
  render() {
    return (
      <div>
        Waiting for host to start
        <Players players={this.props.players}/>
      </div>
    );
  }
}

export default PlayerWaitingToStart;