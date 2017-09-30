import React, { Component } from 'react';
import Players from '../components/Players'
class HostWaitingToStart extends Component {
  render() {
    return (
      <div>
        Waiting for players
        {this.props.players.length > 1 && <button className="button" onClick={() => this.props.onStartGame()}>Start game</button>}
        <Players players={this.props.players}/>
      </div>
    );
  }
}

export default HostWaitingToStart;