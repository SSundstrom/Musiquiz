import React, { Component } from 'react';

class PlayerGuess extends Component {
  render() {
    return (
      <div>
        <form onSubmit="">
          <label>
            Enter a song name
            <input type="text" />
          </label>
          <input type="submit" value="Join" />
        </form>
      </div>
    );
  }
}

export default PlayerGuess;