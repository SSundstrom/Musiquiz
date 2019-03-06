/* eslint-disable react/no-unused-state */
/* global alert */
// first we will make a new context
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { on, emit } from './api';

export const GameContext = React.createContext();

// Then create a provider Component
export class GameProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      players: [],
      isHost: false,
      hasHost: false,
      nickname: null,
      started: false,
      guessTimer: null,
      isLeader: false,
      leader: null,
      correctSong: null,
      songToPlay: null,
      guessed: false,
    };
  }

  componentDidMount() {
    on('connect', data => {
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
      const player = players.find(p => p.nickname === nickname);
      player.score += player.scoreUpdate;
    });

    on('roomNotFound', () => {
      alert('No such room');
    });

    on('playerAlreadyExists', () => {
      alert('Player Already Exists');
    });

    on('joined', nickname => {
      this.setState({
        nickname,
      });
    });

    on('kick', data => {
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
        });
      }
    });

    on('status', data => {
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

    on('leader', data => {
      const { nickname } = this.state;
      this.setState({
        leader: data,
        correctSong: null, // <-- chnage to view from correct song to showing who is up next.
        isLeader: data.nickname === nickname,
      });
    });

    on('stopRound', data => {
      this.setState({
        correctSong: data.selectedSong,
      });
    });

    on('startRound', ({ roundTime }) => {
      this.setState({
        correctSong: null,
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

    on('hostPlaySong', data => {
      this.setState({
        songToPlay: data,
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  joinAsPlayer(nickname, name) {
    console.log(name);
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
    emit('selectedSong', { song, name });
  }

  render() {
    const { children } = this.props;
    return (
      <GameContext.Provider
        value={{
          state: this.state,
          onKickPlayer: player => this.kickPlayer(player),
          onJoinAsPlayer: (n, r) => this.joinAsPlayer(n, r),
          onJoinAsHost: () => this.joinAsHost(),
          onGuess: song => this.guess(song),
          onSelectSong: song => this.selectSong(song),
          onSaveSettings: time => this.sendSettings(time),
        }}
      >
        {children}
      </GameContext.Provider>
    );
  }
}
GameProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};
GameProvider.defaultProps = {
  children: null,
};
export const GameConsumer = GameContext.Consumer;
