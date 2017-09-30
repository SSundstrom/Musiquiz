import React, { Component } from 'react';

class JoinAsPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: ''
    }
  }

  render() {
    return (
      <div>
        Join a game
        <form onSubmit={() => this.props.onJoinAsPlayer(this.state.nickname)}>
          <label>
            Nickname
            <input 
              type="text" 
              onChange={(e) => this.setState({nickname: e.currentTarget.value})} 
              value={this.state.nickname} 
            />
          </label>
          <input type="submit" value="Join" />
        </form>
      </div>
    );
  }
}

export default JoinAsPlayer;