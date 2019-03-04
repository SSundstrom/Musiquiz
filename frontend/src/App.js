import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTimes } from '@fortawesome/free-solid-svg-icons';
import Game from './Game';
import { on, emit } from './api';
import Layout from './components/Layout';

library.add(faCog);
library.add(faTimes);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isHost: false,
      hasHost: false,
      started: false,
      guessTimer: 0,
      isLeader: false,
      guessed: false,
      playing: false,
    };
  }

  componentDidMount() {
    console.log(process.env);
    on('connect', (data) => {
      console.log(data);
      const { nickname } = this.state;
      if (this) {
        if (nickname) {
          emit('reconnected', {
            nickname,
          });
        } else {
          console.log('Connected');
        }
      } else {
        console.log('Connected');
      }
    });

    on('disconnect', () => {
      const { nickname, players } = this.state;
      const player = players.find(p => players.nickname === nickname);
      player.score += player.scoreUpdate;
    });
    on('roomNotFound', (data) => {
      alert('No such room');
    });
    on('playerAlreadyExists', (data) => {
      alert('Player Already Exists');
    });
    on('joined', (nickname) => {
      this.setState({
        nickname,
      });
    });
    on('kick', (data) => {
      const { nickname } = this.state;
      if (nickname === data) {
        this.setState({
          nickname: null,
          loading: false,
          isHost: false,
          hasHost: false,
          started: false,
          guessTimer: 0,
          isLeader: false,
          guessed: false,
          playing: false,
        });
      }
    });
    on('status', (data) => {
      console.log(data);
      const state = {
        ...data,
        loading: false,
      };
      if (data.gamestate === 'pregame') {
        state.hasHost = false;
        state.started = false;
        state.nickname = false;
        state.isHost = false;
      } else if (data.gamestate === 'lobby') {
        state.hasHost = true;
      } else if (data.gamestate === 'choose') {
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

    on('leader', (data) => {
      const { nickname } = this.state;
      this.setState({
        leader: data,
        selectedSong: null,
        correctSong: false, // <-- chnage to view from correct song to showing who is up next.
        isLeader: data.nickname === nickname,
      });
    });

    on('stopRound', (data) => {
      this.setState({
        correctSong: data.selectedSong,
      });
    });

    on('startRound', ({ roundTime }) => {
      this.setState({
        correctSong: false,
        guessed: false,
        guessTimer: roundTime / 1000,
      });

      clearInterval(this.guessInterval);
      this.guessInterval = undefined;
      this.guessInterval = setInterval(() => {
        const { guessTimer } = this.state;
        if (guessTimer < 1) {
          clearInterval(this.guessInterval);
          this.guessInterval = undefined;
          this.setState({
            guessTimer: 0,
          });
          return;
        }
        this.setState({
          guessTimer: guessTimer - 1,
        });
      }, 1000);
    });

    on('hostPlaySong', (data) => {
      this.setState({
        songToPlay: data,
      });
    });

    on('playingSong', (data) => {
      this.setState({
        playing: data,
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  joinAsPlayer(nickname, name) {
    if (!nickname.length) {
      return;
    }
    emit('join', { nickname, name });
  }

  joinAsHost() {
    this.setState(
      {
        isHost: true,
        hasHost: true,
      },
      () => emit('hostJoin'),
    );
  }

  kickPlayer(player) {
    const { name } = this.state;
    emit('kick', { name, player });
  }

  guess(song) {
    const { guessed, nickname, name } = this.state;
    if (!guessed) {
      this.setState(
        {
          guessed: true,
        },
        () => emit('guess', { song, name, nickname }),
      );
    }
  }

  sendSettings(settings) {
    const { name } = this.state;
    emit('settings', { name, settings });
  }

  selectSong(song) {
    const { name } = this.state;
    this.setState(
      {
        selectedSong: true,
      },
      () => emit('selectedSong', { song, name }),
    );
  }

  render() {
    const {
      name,
      loading,
      isLeader,
      isHost,
      hasHost,
      players,
      nickname,
      started,
      leader,
      guessTimer,
      correctSong,
      songToPlay,
      guessed,
      playing,
    } = this.state;
    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <Layout isLeader={isLeader} isHost={isHost}>
        <Game
          name={name}
          players={players}
          isHost={isHost}
          hasHost={hasHost}
          nickname={nickname}
          started={started}
          guessTimer={guessTimer}
          isLeader={isLeader}
          leader={leader}
          correctSong={correctSong}
          songToPlay={songToPlay}
          guessed={guessed}
          playing={playing}
          onKickPlayer={player => this.kickPlayer(player)}
          onJoinAsPlayer={(n, r) => this.joinAsPlayer(n, r)}
          onJoinAsHost={() => this.joinAsHost()}
          onGuess={song => this.guess(song)}
          onSelectSong={song => this.selectSong(song)}
          onSaveSettings={time => this.sendSettings(time)}
        />
      </Layout>
    );
  }
}

export default App;
