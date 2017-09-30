import React, { Component } from 'react';
import Scores from '../components/Scores'
import Track from '../components/Track'
class HostMusicPlayer extends Component {
  render() {
    const track = this.props.correctSong
    return (
      <div>
        Host music player

        <h1>{this.props.correctSongTimer}</h1>

        {track && (<div>Correct song was <Track track={track}/></div>)}            
        
        <div><Scores score={this.props.score}/></div>
      </div>
      
    );
  }
}

export default HostMusicPlayer;