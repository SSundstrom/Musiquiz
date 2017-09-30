import React, { Component } from 'react';
import Game from './Game';
import { on, emit, search } from './api';
import Layout from './components/Layout';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isHost: false,
      hasHost: true,
      nickname: '',
      players: [],
      started: false,
      score: {},
      guessTimer: 10,
      correctSongTimer: 10,
      leader: 'test',
      isLeader: false,
      correctSong: false,
      songToPlay: false
    }
  }

  componentDidMount() {
    on('status', (data) => this.setState({
      loading: false,
      players: data.players,
      score: data.score
    }));

    on('leader', (data) => this.setState({
      leader: data,
      isLeader: data === this.state.nickname
    }));

    on('correctSong', (data) => {
      this.setState({
        correctSong: data,
        correctSongTimer: 10
      });

      var interval = setInterval(() => {
        if (this.state.correctSongTimer === 1) {
          clearInterval(interval);
        }

        this.setState({
          correctSongTimer: this.state.correctSongTimer === 1 ? 0 : this.state.correctSongTimer-1
        });
      }, 1000);
    });
    
    on('startRound', (data) => {
      this.setState({
        correctSong: false,
        guessed: false,
        guessTimer: 20
      });

      var interval = setInterval(() => {
        if (this.state.guessTimer === 1) {
          clearInterval(interval);
        }

        this.setState({
          guessTimer: this.state.guessTimer === 1 ? 0 : this.state.guessTimer - 1
        });
      }, 1000);
    });

    on('hostPlaySong', (data) => this.setState({
      songToPlay: data
    }));
  }

  startGame() {
    emit('hostStartGame');
  }

  resetGame() {
    emit('hostResetGame');
  }

  joinAsPlayer(nickname) {
    this.setState({
      nickname: nickname
    }, () => emit('join', nickname));
  }

  joinAsHost() {
    this.setState({
      isHost: true,
      hasHost: true
    }, () => emit('hostJoin'));
  }
  
  guess(uri) {
    if (!this.state.guessed) {
      this.setState({
        guessed: true
      }, () => emit('guess', uri));
    }
  }

  render() {
    if (this.state.loading) {
      return <div>Loading...</div>;
    }

    return (
      <Layout>
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

          onStartGame={() => this.startGame()}
        />
      </Layout>
    );
  }
}

export default App;
