import React, { Component } from 'react';
import { search as trackSearch } from '../api';
import Track from '../components/Track'
import Scores from '../components/Scores'

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
          <h1 class="small">{this.props.guessTimer}</h1>

          {this.props.guessed && (
            <div>
              <h2>Waiting for other players</h2>
              <Scores score={this.props.score} nickname={this.props.nickname} scoreUpdates={this.props.scoreUpdates}/>
            </div>
          )}

          {!this.props.guessed && (
            <div>
              <label>
                Guess the song name
              <input
                  type="text"
                  onChange={(e) => this.onChange(e.currentTarget.value)}
                  value={this.state.value}
                />
              </label>
              {this.state.results.map(track => (
                <Track track={track} onClick={() => this.props.onGuess(track.uri)}/>
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
        this.setState({results:results})
      }
    });
  }
}

export default PlayerGuess;