import React, { Component } from 'react';
import Scores from '../components/Scores'
import Track from '../components/Track'

class ShowCorrectSong extends Component {
  render() {
    console.log(this.props.correctSong)
    const track = this.props.correctSong
    return (
      <div>
        <h1>{this.props.correctSongTimer}</h1>
        <div>Correct song was</div>
        <div>
          <Track track={track}/> 
            
          <Scores score={this.props.score}/>
        </div>
      </div>
    );
  }
}

export default ShowCorrectSong;