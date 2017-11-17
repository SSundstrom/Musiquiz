import React, { Component } from 'react';
import { search as trackSearch } from '../api';
import Track from '../components/Track'
import RecommendedSongs from '../components/RecommendedSongs'

class LeaderChooseSong extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      results: []
    };
  }

  render() {
    return (
      <div>
          <label>
            <h2>Dude, enter a song name</h2>
            <input 
              type="text" 
              onChange={(e) => this.onChange(e.currentTarget.value)} 
              value={this.state.value}
            />
          </label>
          {this.state.value.length > 0 && this.state.results.map(track => (
            <Track track = {track} onClick={() => this.props.onSelectSong(track)}/>
          ))}
          {this.state.value.length === 0 && (
            <RecommendedSongs onSelectSong={this.props.onSelectSong} />
          )}
      </div>
    );
  }

  onChange(value) {
    this.setState({
      value: value
    });

    this.search(value);
  }

  search(value) {
    if (value.length < 2) {
      return this.setState({
        results: []
      });
    }

    trackSearch(value, (results) => {
      if (value === this.state.value) {
        this.setState({ results: results })
      }
    });
  }
}

export default LeaderChooseSong;