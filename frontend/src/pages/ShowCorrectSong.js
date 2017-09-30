import React, { Component } from 'react';
import Scores from '../components/Scores'

class ShowCorrectSong extends Component {
  render() {
    return (
      <div>
        <div>Correct song was ...</div>
        <div><Scores score={this.props.score}/></div>
      </div>
    );
  }
}

export default ShowCorrectSong;