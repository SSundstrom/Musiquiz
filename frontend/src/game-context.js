/* eslint-disable react/no-unused-state */
/* global alert */
// first we will make a new context
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Cookies, withCookies } from 'react-cookie';
import uuidv4 from 'uuid';
import { on, emit } from './api';

export const GameContext = React.createContext();
export const GameConsumer = GameContext.Consumer;

// Then create a provider Component
class GameProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: null,
      players: [],
      isHost: false,
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
    const { cookies } = this.props;
    const session = cookies.get('session');
    if (session && session.nickname && session.name) {
      console.log(session);
      this.joinAsPlayer(session.nickname, session.name);
    }
    on('disconnect', () => {
      console.log('disc');
    });
    on('connect', () => {
      const { nickname, name } = this.state;
      if (nickname) {
        emit('join', { nickname, name });
      }
    });
    on('playerDisconnected', player => {
      const { players } = this.state;
      if (player) {
        this.setState({ players: players.filter(p => p.nickname !== player.nickname) });
      }
    });
    on('roomNotFound', () => {
      // alert('No such room');
    });

    on('playerAlreadyExists', () => {
      // alert('Player Already Exists');
    });

    on('joinSuccess', ({ nickname, foundRoom }) => {
      const { leader } = foundRoom;
      this.setState({
        nickname,
        isLeader: leader ? leader.nickname === nickname : false,
        ...foundRoom,
      });
      this.startGuessTimer();
    });
    on('playerJoined', player => {
      const { players, nickname } = this.state;
      const foundPlayer = players.find(p => p.nickname === player.nickname);
      if (foundPlayer) {
        this.setState({
          players: this.updatePlayers(foundPlayer),
        });
      } else if (player.nickname !== nickname) {
        players.push(player);
      }
      this.setState({ players });
    });
    on('kick', data => {
      const { nickname } = this.state;
      if (nickname === data) {
        this.setState({
          name: null,
          players: [],
          isHost: false,
          nickname: null,
          started: false,
          guessTimer: null,
          isLeader: false,
          leader: null,
          correctSong: null,
          songToPlay: null,
          guessed: false,
        });
      }
    });

    on('updatePlayer', player => {
      const players = this.updatePlayers(player);
      this.setState({
        players,
      });
    });

    on('playerGuess', player => {
      console.log('playerGuess');
      const { nickname, guessed, correct } = this.state;
      const newPlayers = this.updatePlayers(player);
      const thisPlayer = player.nickname === nickname;
      this.setState({
        players: newPlayers,
        correct: thisPlayer ? player.correct : correct,
        guessed: thisPlayer ? true : guessed,
      });
    });
    on('updatePlayers', players => {
      this.setState({ players });
    });
    on('reset', () => {
      this.setState({
        name: null,
        players: [],
        isHost: false,
        nickname: null,
        started: false,
        guessTimer: null,
        isLeader: false,
        leader: null,
        correctSong: null,
        songToPlay: null,
        guessed: false,
      });
    });

    on('leader', leader => {
      const { nickname } = this.state;
      this.setState({
        leader,
        correctSong: null, // <-- chnage to view from correct song to showing who is up next.
        isLeader: leader.nickname === nickname,
      });
    });

    on('stopRound', data => {
      this.setState({
        guessTimer: 0,
        correctSong: data.selectedSong,
      });
    });
    on('startChoose', () => {
      this.setState({ started: true, guessed: false });
    });
    on('startRound', roundTime => {
      this.setState({
        correctSong: null,
        guessed: false,
        guessTimer: roundTime / 1000,
      });
      this.startGuessTimer();
    });

    on('hostPlaySong', data => {
      this.setState({
        songToPlay: data,
      });
    });

    on('hostJoin', data => {
      this.setState({
        ...data,
      });
    });
  }

  updatePlayers(player) {
    const { players } = this.state;
    const newPlayers = players.filter(p => p.nickname !== player.nickname);
    newPlayers.push(player);
    return newPlayers;
  }

  startGuessTimer() {
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
  }

  joinAsPlayer(nickname, name) {
    const { cookies } = this.props;
    const session = cookies.get('session');
    if (!session || session.name !== name) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      cookies.set('session', { sessionId: uuidv4(), nickname, name }, { path: '/', expires: tomorrow });
    }
    if (!nickname.length) {
      return;
    }
    emit('join', { nickname, name, sessionId: cookies.get('session').sessionId });
  }

  joinAsHost() {
    this.setState(
      {
        isHost: true,
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
      emit('guess', { song, name, nickname });
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
  cookies: PropTypes.instanceOf(Cookies).isRequired,
};
GameProvider.defaultProps = {
  children: null,
};
export default withCookies(GameProvider);
