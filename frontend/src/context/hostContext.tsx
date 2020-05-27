/* eslint-disable react/no-unused-state */
/* global window */
// first we will make a new context
import React, { Component } from 'react';
import { ReactCookieProps, withCookies } from 'react-cookie';
import { emit, on } from '../api';
import { GameState, IPlayer } from '../types';
interface HostContextInterfacte {
  state: State;
  onKickPlayer: (nickname: string) => void;
  onJoinAsHost: (name: string) => void;
  onSaveSettings: (setting: any) => void;
  onShowSettings: () => void;
}

export const HostContext = React.createContext<HostContextInterfacte | undefined>(undefined);
export const HostConsumer = HostContext.Consumer;
const initialState: State = {
  players: [],
  started: false,
  showSettings: true,
  leaderTimer: 0,
  guessTimer: 0,
  joined: false,
  gamestate: GameState.LOBBY,
};
interface State {
  name?: string;
  players: IPlayer[];
  started: boolean;
  guessTimer: number;
  leaderTimer: number;
  leader?: IPlayer;
  joined: boolean;
  correctSong?: string;
  songToPlay?: string;
  showSettings: boolean;
  gamestate: GameState;
}
interface Props {}

// Then create a provider Component
class HostProvider extends Component<Props & ReactCookieProps, State> {
  leaderInterval?: number = undefined;
  guessInterval?: number = undefined;
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
      const session = cookies?.get('session');
      if (session && session.nickname && session.name && session.sessionId) {
        emit('join', { ...session });
      }
    });

    on('playerDisconnected', (player: IPlayer) => {
      if (player) {
        this.setState({ players: this.updatePlayers(player) });
      }
    });

    on('playerJoined', (player: IPlayer) => {
      const { leader, players } = this.state;
      const foundPlayer = players.find((p) => p.nickname === player.nickname);
      if (foundPlayer) {
        if (leader?.nickname === foundPlayer.nickname) {
          clearInterval(this.leaderInterval);
          this.setState({ leaderTimer: 0 });
        }
        this.setState({
          players: this.updatePlayers(player),
        });
      } else {
        this.setState({ players: [...this.state.players, player] });
      }
    });

    on('kick', (playerToKick: string) => {
      const { players } = this.state;
      const newPlayers = players.filter((p) => p.nickname !== playerToKick);
      this.setState({
        players: newPlayers,
      });
    });

    on('updatePlayer', (player: IPlayer) => {
      const players = this.updatePlayers(player);
      this.setState({
        players,
      });
    });

    on('playerGuess', (player: IPlayer) => {
      console.log('playerGuess');
      const newPlayers = this.updatePlayers(player);
      this.setState({
        players: newPlayers,
      });
    });

    on('updatePlayers', (players: IPlayer[]) => {
      this.setState({ players });
    });

    on('reset', () => {
      this.setState(initialState);
    });

    on('leader', (leader: IPlayer) => {
      this.setState({
        leader,
      });
    });

    on('stopRound', (correctSong: string) => {
      this.setState({
        guessTimer: 0,
        correctSong,
        gamestate: GameState.FINISHED,
      });
    });

    on('startChoose', () => {
      this.setState({
        started: true,
        gamestate: GameState.CHOOSE,
      });
    });

    on('leaderTimeout', (leaderTime: number) => {
      this.setState({
        leaderTimer: leaderTime / 1000,
      });
      clearInterval(this.leaderInterval);
      this.leaderInterval = undefined;
      this.leaderInterval = window.setInterval(() => {
        const { leaderTimer } = this.state;
        if (leaderTimer < 1) {
          clearInterval(this.leaderInterval);
          this.leaderInterval = undefined;
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
    on('startRound', (roundTime: number) => {
      this.setState({
        guessTimer: roundTime / 1000,
        gamestate: GameState.MIDGAME,
      });
      this.startGuessTimer();
    });

    on('hostPlaySong', (songToPlay: string) => {
      this.setState({
        songToPlay,
      });
    });

    on('hostJoin', (data: State) => {
      this.setState({
        ...data,
        joined: true,
      });
    });
  }

  onShowSettings() {
    const { showSettings } = this.state;
    this.setState({
      showSettings: !showSettings,
    });
  }

  updatePlayers(player: IPlayer) {
    const { players } = this.state;
    return players.map((p) => {
      if (p.nickname === player.nickname) {
        return player;
      }
      return p;
    });
  }

  startGuessTimer() {
    clearInterval(this.guessInterval);
    this.guessInterval = undefined;
    this.guessInterval = window.setInterval(() => {
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

  joinAsHost(name: string) {
    emit('hostJoin', name);
  }

  kickPlayer(nickname: string) {
    const { name } = this.state;
    emit('kick', { name, nickname });
  }

  sendSettings(settings: any) {
    const { name } = this.state;
    emit('settings', { name, settings });
  }

  render() {
    const { children } = this.props;
    return (
      <HostContext.Provider
        value={{
          state: this.state,
          onKickPlayer: this.kickPlayer.bind(this),
          onJoinAsHost: this.joinAsHost.bind(this),
          onSaveSettings: this.sendSettings.bind(this),
          onShowSettings: this.onShowSettings.bind(this),
        }}
      >
        {children}
      </HostContext.Provider>
    );
  }
}

export default withCookies(HostProvider);
