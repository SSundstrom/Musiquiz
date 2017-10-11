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
          <input className="button" type="submit" value="Join" />
        </form>

        <button className="lucky" onClick={() => this.imFeelingLucky()}> 🍀 I'm feeling lucky </button>
      </div>
    );
  }

  imFeelingLucky(){
    var randomNames = ['Quizter Sjögren', 'Quiztina Aguilera', 'Quiz Brown', 'Quiz Medina', 'Ernst Quizteiger', 'Quiztian Luuk', 'Quiztoffer Robinson'];

    randomNames = randomNames.filter(el => {
      return this.props.players.indexOf(el) == -1
    });

    var index = 0;
    index = Math.floor(Math.random()*randomNames.length)
    var nickname = randomNames[index];

    this.props.onJoinAsPlayer(nickname);
  }
}

export default JoinAsPlayer;