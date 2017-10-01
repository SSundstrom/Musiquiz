import React, { Component } from 'react';
import SpotifyPlayer, { auth } from '../playback';

class JoinAsHost extends Component {
  componentDidMount() {
    if (SpotifyPlayer.access_token) {
      this.props.onJoinAsHost();
    }
  }

  render() {
    return (
      <div>
        <h2>Start a game</h2>
        <button className="button" onClick={() => auth()}>Log in with Spotify</button>
      </div>
    );
  }
}

export default JoinAsHost;