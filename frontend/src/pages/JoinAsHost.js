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
        Start a game
        <button className="button" onClick={() => auth()}>Log in with Spotify</button>
      </div>
    );
  }
}

export default JoinAsHost;