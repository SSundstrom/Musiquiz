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

        <button className="spotify-button" onClick={() => auth()}>
          <img src="/spotify.png" height="25" valign="middle" style={{marginLeft: 5}} />
        </button>
      </div>
    );
  }
}

export default JoinAsHost;