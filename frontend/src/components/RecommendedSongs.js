import React, { Component } from 'react';
import { getAudioAnalysis } from '../api';
import Track from '../components/Track'

class RecommendedSongs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: []
    };
  }

  componentDidMount() {
    getAudioAnalysis((data) => {
      console.log(data)
      this.setState({
        results: data
      })
    });
  }

  render() {
    return (
      <div>
        <div> Suggestions </div>
        {this.state.results.map(track => (
          <Track track={track} onClick={() => this.props.onSelectSong(track)}/>
        ))}
      </div>
    );
  }
}

export default RecommendedSongs;