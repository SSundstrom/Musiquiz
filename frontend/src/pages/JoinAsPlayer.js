import React, { Component } from 'react';

class JoinAsPlayer extends Component {
  render() {
    return (
      <div>
        Join a game
        <form onSubmit="">
          <label>
            Nickname
            <input type="text" />
          </label>
          <input type="submit" value="Join" />
        </form>
      </div>
    );
  }
}

export default JoinAsPlayer;