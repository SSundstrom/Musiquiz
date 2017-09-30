import React, { Component } from 'react';
import Scores from '../components/Scores'
import Track from '../components/Track'
import SpotifyPlayer from '../playback';

class HostMusicPlayer extends Component {
  componentWillReceiveProps(newProps) {
    if (this.props.songToPlay !== newProps.songToPlay) {
      console.log('Playing ' + newProps.songToPlay);
      this.playSong(newProps.songToPlay);
    }
  }

  playSong(uri) {
    SpotifyPlayer.controls.play([uri]);
  }

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