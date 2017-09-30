import React, { Component } from 'react';

class JoinAsHost extends Component {
  render() {
    return (
      <div>
        Start a game
        <button className="button" onClick={() => this.props.onJoinAsHost()}>Log in with Spotify</button>
      </div>
    );
  }
}

export default JoinAsHost;