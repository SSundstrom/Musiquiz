import React, { Component } from 'react';
import { search as trackSearch } from '../api';

class PlayerGuess extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
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

    trackSearch(value, function(results) {
      console.log(results);
    });
  }
}

export default PlayerGuess;