/* eslint-disable react/no-unused-state */
/* global window */
// first we will make a new context
import React, { Component } from 'react';
import { Cookies, withCookies } from 'react-cookie';
import { v4 as uuidv4 } from 'uuid';
import { emit, on } from '../api';
import { GameState } from '../types';

const initialState: State = {
  name: null,
  nickname: null,
  started: false,
  guessTimer: 0,
  leaderTimer: 0,
  isLeader: false,
  leader: null,
  joined: false,
  correctSong: null,
  correct: false,
  guessed: false,
  gamestate: null,
  roomNotFound: false,
};
interface Player {
  nickname: string;
  active: boolean;
  connected: boolean;
  score: number;
  scoreUpdate: number;
  sessionId: string;
}
interface PlayerContextInterface {
  state: State;
  onJoinAsPlayer: (nickname: string, name: string) => void;
  onJoinRoom: (name: string) => void;
  onGuess: (song: string) => void;
  onSelectSong: (song: string) => void;
  lucky: (name: string) => void;
  leave: (name: string) => void;
}
export const PlayerContext = React.createContext<PlayerContextInterface | undefined>(undefined);
export const PlayerContextConsumer = PlayerContext.Consumer;
const PlayerContextProvider = PlayerContext.Provider;

interface Props {
  cookies: Cookies;
}
interface State {
  name: string | null;
  nickname: string | null;
  started: boolean;
  guessTimer: number;
  leaderTimer: number;
  isLeader: boolean;
  leader: Player | null;
  correct: boolean;
  joined: boolean;
  correctSong: string | null;
  guessed: boolean;
  roomNotFound: boolean;
  gamestate: string | null;
}
// Then create a provider Component
class PlayerProvider extends Component<Props, State> {
  leaderInterval?: number;
  guessInterval?: number;
  constructor(props: Props) {
    super(props);

    this.state = {
      ...initialState,
    };
  }

  componentDidMount() {
    const { cookies } = this.props;
    on('disconnect', () => {
      console.log('disc');
    });

    on('connect', () => {
      const session = cookies.get('session');
      if (session && session.nickname && session.name && session.sessionId) {
        emit('join', { ...session });
      }
    });
    on('lucky', (nickname: string) => {
      this.setState({ nickname });
    });

    on('roomNotFound', () => {
      cookies.remove('session');
      this.setState({
        ...initialState,
        roomNotFound: true,
      });
    });
    on('roomFound', ({ room }: { room: any }) => {
      cookies.remove('session');
      console.log(room);
      this.setState({
        ...room,
      });
    });

    on('playerAlreadyExists', () => {
      this.setState({
        ...initialState,
      });
    });

    on('joinSuccess', ({ nickname, room }: { nickname: string; room: any }) => {
      const { leader }: { leader: Player } = room;
      this.setState({
        nickname,
        joined: true,
        isLeader: leader ? leader.nickname === nickname : false,
        ...room,
      });
      const session = cookies.get('session');
      session.nickname = nickname;
      cookies.set('session', session);
      if (room.gamestate === GameState.MIDGAME) {
        this.startGuessTimer();
      }
    });

    on('kick', ({ nickname }: { nickname: string }) => {
      if (this.state.nickname === nickname) {
        this.setState({
          ...initialState,
        });
        cookies.remove('session');
      }
    });

    on('playerGuess', (player: any) => {
      console.log('playerGuess');
      const { nickname, guessed, correct } = this.state;
      const thisPlayer = player.nickname === nickname;
      this.setState({
        correct: thisPlayer ? player.correct : correct,
        guessed: thisPlayer ? true : guessed,
      });
    });

    on('reset', () => {
      this.setState({ ...initialState });
    });

    on('leader', (leader: Player) => {
      const { nickname } = this.state;
      this.setState({
        leader,
        isLeader: leader.nickname === nickname ? true : false,
      });
    });

    on('stopRound', ({ correctSong, gamestate }: { correctSong: string; gamestate: string }) => {
      this.setState({
        guessTimer: 0,
        correctSong,
        gamestate,
      });
    });

    on('startChoose', () => {
      this.setState({
        started: true,
        guessed: false,
        gamestate: GameState.CHOOSE,
      });
    });
    on('leaderTimeout', (leaderTime: number) => {
      this.setState({
        leaderTimer: leaderTime / 1000,
      });
      clearInterval(this.leaderInterval);
      this.leaderInterval = window.setInterval(() => {
        const { leaderTimer } = this.state;
        if (leaderTimer < 1) {
          clearInterval(this.leaderInterval);
          this.setState({
            leaderTimer: 0,
          });
          return;
        }
        this.setState({
          leaderTimer: leaderTimer - 1,
        });
      }, 1000);
    });
    on('startRound', ({ roundTime, gamestate }: { roundTime: number; gamestate: string }) => {
      this.setState({
        guessed: false,
        guessTimer: roundTime / 1000,
        gamestate,
      });
      this.startGuessTimer();
    });
  }

  startGuessTimer() {
    clearInterval(this.guessInterval);

    this.guessInterval = window.setInterval(() => {
      const { guessTimer } = this.state;
      if (guessTimer < 1) {
        clearInterval(this.guessInterval);

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

  joinAsPlayer(nickname: string, name: string) {
    const { cookies } = this.props;
    const session = cookies.get('session');
    if (!session || session.name !== name) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      cookies.set('session', { sessionId: uuidv4(), name }, { path: '/', expires: tomorrow });
    }
    if (!nickname.length) {
      return;
    }
    emit('join', {
      nickname,
      name,
      sessionId: cookies.get('session').sessionId,
    });
  }

  joinRoom(name: string) {
    emit('joinRoom', { name });
  }

  leave() {
    const { name, nickname } = this.state;
    emit('kick', { name, nickname });
  }

  lucky(name: string) {
    emit('lucky', name);
  }

  guess(song: string) {
    const { guessed, nickname, name } = this.state;
    if (!guessed) {
      emit('guess', { song, name, nickname });
    }
  }

  selectSong(song: string) {
    const { name } = this.state;
    emit('selectedSong', { song, name });
  }

  render() {
    const { children } = this.props;
    return (
      <PlayerContextProvider
        value={{
          state: this.state,
          onJoinAsPlayer: this.joinAsPlayer.bind(this),
          onJoinRoom: this.joinRoom.bind(this),
          onGuess: this.guess.bind(this),
          onSelectSong: this.selectSong.bind(this),
          lucky: this.lucky,
          leave: this.leave,
        }}
      >
        {children}
      </PlayerContextProvider>
    );
  }
}

export default withCookies(PlayerProvider);
