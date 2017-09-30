import React, { Component } from 'react';
import { search as trackSearch } from '../api';

class PlayerGuess extends Component {
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
          <h1>{this.props.guessTimer}</h1>

          {this.props.guessed && (
            <div>Waiting for other players</div>
          )}

          {!this.props.guessed && (
            <div>
              <label>
                Enter a song name
              <input
                  type="text"
                  onChange={(e) => this.onChange(e.currentTarget.value)}
                  value={this.state.value}
                />
              </label>
              {this.state.results.map(track => (
                <button className="trackitem" onClick={() => this.props.onGuess(track.uri)}>
                  <img src={track.al} />
                  <div className="trackname"> {track.name} </div>
                  <div className="trackartists"> {track.artists.map(artist => <span>{artist.name}</span>)} </div>
                </button>
              ))}
            </div>
          )}
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

export default PlayerGuess;