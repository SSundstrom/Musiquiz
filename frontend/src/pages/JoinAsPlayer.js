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
        <form onSubmit={(e) => { e.preventDefault(); this.props.onJoinAsPlayer(this.state.nickname); return false; }}>
          <label>
            Dude, what's your name?
            <input 
              type="text" 
              onChange={(e) => this.setState({nickname: e.currentTarget.value})} 
              value={this.state.nickname} 
              
            />
          </label>
          <button className="lucky" onClick={ ()=> this.imFeelingLucky()}> 🍀 I'm feeling lucky </button>
          <input className="button" type="submit" value="Join" />
        </form>
      </div>
    );
  }

  imFeelingLucky(){
    var randomNames = ['Quizter Sjögren', 'Quiztina Aguilera', 'Quiz Brown']
  
    var nickname = randomNames[Math.floor(Math.random()*randomNames.length)];

    this.props.onJoinAsPlayer(nickname);
  }
}

export default JoinAsPlayer;