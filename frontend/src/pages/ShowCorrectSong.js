import React, { Component } from 'react';
import Scores from '../components/Scores'


class ShowCorrectSong extends Component {
  render() {
    console.log(this.props.correctSong)
    const track = this.props.correctSong
    return (
      <div>
        <div>Correct song was</div>
          <div className="trackitem">
              <img src={track.album.images[2].url}/>
              <div className="trackinfo">
                <div className="trackname"> {track.name} </div>
                <div className="trackartists"> {track.artists.map(artist => <span>{artist.name }</span>)} </div>
              </div>
            
        
        <div><Scores score={this.props.score}/></div>
      </div>
      </div>
    );
  }
}

export default ShowCorrectSong;