import React, { Component } from 'react';
import Scores from '../components/Scores'
class HostMusicPlayer extends Component {
  render() {
    return (
      <div>
        Host music player
        <div><Scores score={this.props.score}/></div>
      </div>
    );
  }
}

export default HostMusicPlayer;