import React, { Component } from 'react';
import Game from './Game';
import { on, emit, search } from './api';
import Layout from './components/Layout';

const GUESS_TIMER = 30;
const CORRECT_SONG_TIMER = 10;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isHost: false,
      hasHost: false,
      nickname: '',
      players: [],
      started: false,
      score: {},
      guessTimer: GUESS_TIMER,
      correctSongTimer: CORRECT_SONG_TIMER,
      leader: false,
      isLeader: false,
      correctSong: false,
      songToPlay: false,
      guessed: false,
      selectedSong: false
    }
  }

  componentDidMount() {
    on('status', (data) => {
      const state = {
        loading: false,
        players: data.players,
        score: data.score
      };

      if (data.gamestate === 'pregame') {
         state.hasHost = false;
      } else if (data.gamestate === 'lobby') {
        state.hasHost = true;
      } else if (data.gamestate === 'choose') {
        state.guessTimer = 0;
        state.started = true;
      } else if (data.gamestate === 'midgame') {
        // ?
      } else if (data.gamestate === 'finished') {
        state.guessTimer = 0;
      }

      this.setState(state);
    });

    on('leader', (data) => this.setState({
      leader: data,
      selectedSong: false,
      isLeader: data === this.state.nickname
    }));

    on('correctSong', (data) => {
      this.setState({
        correctSong: data,
        correctSongTimer: CORRECT_SONG_TIMER
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
        guessTimer: GUESS_TIMER
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
    if (!nickname.length) {
      return;
    }

    if (this.state.nickname) {
      return;
    }

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

  selectSong(song) {
    this.setState({
      selectedSong: true
    }, () => emit('selectedSong', song));
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
          songToPlay={this.state.songToPlay}

          onStartGame={() => this.startGame()}
          onJoinAsPlayer={(nickname) => this.joinAsPlayer(nickname)}
          onJoinAsHost={() => this.joinAsHost()}
          onGuess={(uri) => this.guess(uri)}
          onSelectSong={(song) => this.selectSong(song)}
        />
      </Layout>
    );
  }
}

export default App;
