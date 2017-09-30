import React, { Component } from 'react';
import Game from './Game';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isHost: true,
      hasHost: false,
      nickname: '',
      players: [],
      started: false,
      score: {},
      guessTimer: 10,
      correctSongTimer: 10,
      leader: 'test',
      isLeader: false,
      correctSong: {
        image: '',
        title: 'Test song',
        artist: 'Test artist'
      }
    }
  }

  render() {
    if (this.state.loading) {
      return <div>Loading...</div>;
    }

    return (
      <Game
        isHost={this.state.isHost}
        hasHost={this.state.hasHost}
        nickname={this.state.nickname}
        started={this.state.started}
        players={this.state.players}
        score={this.state.score}
        leader={this.state.leader}
        guessTimer={this.state.guessTimer}
        isLeader={this.state.isLeader}
        correctSong={this.state.correctSong}
        correctSongTimer={this.state.correctSongTimer}
      />
    );
  }
}

export default App;
