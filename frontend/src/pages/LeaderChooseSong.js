import React, { Component } from 'react';
import { search as trackSearch } from '../api';

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
            Enter a song name
            <input 
              type="text" 
              onChange={(e) => this.onChange(e.currentTarget.value)} 
              value={this.state.value}
            />
          </label>
          {this.state.results.map(tracks => (
            <div className="trackitem">
              <img src={tracks.al}/>
              <div className="trackname"> {tracks.name} </div>
              <div className="trackartists"> {tracks.artists.map(artist => <span>{artist.name}</span>)} </div>
            </div>
          ))}
      </div>
    );
  }

  onChange(value) {
    this.setState({
      value: value
    });

    console.log(value);

    setTimeout(() => {
      if (this.state.value === value) {
        this.search(value);
      }
    }, 50);
  }

  search(value) {
    if (value.length < 2) {
      return this.setState({
        results: []
      });
    }
    trackSearch(value, (results) => {
      console.log(results);
      this.setState({results:results})
    });
  }
}

export default LeaderChooseSong;