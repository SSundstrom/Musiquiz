import React, { Component } from 'react';
import Game from './Game';
import { on, emit, search } from './api';
import Layout from './components/Layout';

const CORRECT_SONG_TIMER = 10;

class App extends Component {
  interval;
  
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isHost: false,
      hasHost: false,
      nickname: false,
      players: [],
      started: false,
      score: {},
      oldScore: false,
      guessTimer: 0,
      correctSongTimer: CORRECT_SONG_TIMER,
      leader: false,
      isLeader: false,
      correctSong: false,
      songToPlay: false,
      guessed: false,
      selectedSong: false,
      playing:false,
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
         state.started = false;
         state.nickname = false;
         state.isHost = false
      } else if (data.gamestate === 'lobby') {
        state.hasHost = true;
      } else if (data.gamestate === 'choose') {
        state.guessTimer = 0;
        state.started = true;
        state.hasHost = true;
      } else if (data.gamestate === 'midgame') {
        state.hasHost = true;
      } else if (data.gamestate === 'finished') {
        state.guessTimer = 0;
        state.hasHost = true;
      }

      this.setState(state);
    });

    on('leader', (data) => this.setState({
      leader: data,
      selectedSong: false,
      isLeader: data === this.state.nickname
    }));

    on('stopRound', (data) => {
      this.setState({
        correctSong: data,
        correctSongTimer: CORRECT_SONG_TIMER
      });

      clearInterval(this.correctSongInterval);
      this.correctSongInterval = undefined;

      this.correctSongInterval = setInterval(() => {
        if (this.state.correctSongTimer < 1) {
          clearInterval(this.correctSongInterval);
          this.correctSongInterval = undefined;
          this.setState({
            correctSongTimer: 0
          });
          return;
        }

        this.setState({
          correctSongTimer: this.state.correctSongTimer - 1
        });
      }, 1000);
    });
    
    on('startRound', (data) => {
      this.setState({
        correctSong: false,
        guessed: false,
        guessTimer: data / 1000,
        oldScore: this.state.score
      });

      clearInterval(this.guessInterval);
      this.guessInterval = undefined;

      this.guessInterval = setInterval(() => {
        if (this.state.guessTimer < 1) {
          clearInterval(this.guessInterval);
          this.guessInterval = undefined;
          this.setState({
            guessTimer: 0
          });
          return;
        }

        this.setState({
          guessTimer: this.state.guessTimer - 1
        });
      }, 1000);
    });

    on('hostPlaySong', (data) => this.setState({
      songToPlay: data
    }));

    on('playingSong', (data) => this.setState({
      playing: data
    }))

    on('reconnect', (attempts) => {
      if (this.state.nickname) {
        emit('reconnected', this.state.nickname)
      }
    })
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

    if (this.state.players.indexOf(nickname) !== -1) {
      return alert('There\'s already someone with that name!');
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

  sendTime(time) {
    this.setState({timer: time}, () => emit('timer', time))
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
      <Layout isLeader={this.state.isLeader} isHost={this.state.isHost}>
        <Game
          isHost={this.state.isHost}
          hasHost={this.state.hasHost}
          nickname={this.state.nickname}
          started={this.state.started}
          players={this.state.players}
          score={this.state.score}
          oldScore={this.state.oldScore}
          leader={this.state.leader}
          guessTimer={this.state.guessTimer}
          isLeader={this.state.isLeader}
          correctSong={this.state.correctSong}
          correctSongTimer={this.state.correctSongTimer}
          songToPlay={this.state.songToPlay}
          guessed={this.state.guessed}
          playing={this.state.playing}

          onStartGame={() => this.startGame()}
          onJoinAsPlayer={(nickname) => this.joinAsPlayer(nickname)}
          onJoinAsHost={() => this.joinAsHost()}
          onGuess={(uri) => this.guess(uri)}
          onSelectSong={(song) => this.selectSong(song)}
          onChangeTimer={(time) => this.sendTime(time)}
        />
      </Layout>
    );
  }
}

export default App;
