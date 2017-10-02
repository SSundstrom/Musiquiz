import React, { Component } from 'react';
import Scores from '../components/Scores'
import Track from '../components/Track'

class PlayerWaitingForLeader extends Component {
  render() {
    console.log(this.props.correctSong)
    const track = this.props.correctSong
    return (
      <div>
        <h2>Waiting for {this.props.leader} to choose a song</h2>
        <div>
          
          {track && <Track track={track}/>}
          <Scores score={this.props.score} nickname={this.props.nickname} oldScore={this.props.oldScore}/>
        </div>
      </div>
    );
  }
}
export default PlayerWaitingForLeader;