import React, { Component } from 'react';
import Game from './Game';
import { on, emit } from './api';
import Layout from './components/Layout';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isHost: false,
      hasHost: false,
      nickname: false,
      started: false,
      guessTimer: 0,
      isLeader: false,
      correctSong: false,
      songToPlay: false,
      guessed: false,
      roomNotFound: false,
      playing: false,
    };
  }

  componentDidMount() {
    on('connect', (data) => {
      const { nickname, score } = this.state;
      if (this) {
        if (nickname) {
          console.log(`reconnected ${nickname}${score[nickname]}`);
          emit('reconnected', {
            nickname,
            score: score[nickname],
          });
        } else {
          console.log('Connected');
        }
      } else {
        console.log('Connected');
      }
    });

    /* on('disconnect', () => {
      const { nickname, score, scoreUpdates } = this.state;

      if (nickname in scoreUpdates) {
        score[nickname] += scoreUpdates[nickname];
      }
    }); */
    on('roomNotFound', (data) => {
      this.setState({ roomNotFound: true });
    });
    on('status', (data) => {
      console.log(data);
      const state = {
        room: data,
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

    on('leader', (data) => {
      const { nickname } = this.state;
      this.setState({
        leader: data,
        selectedSong: false,
        correctSong: false, // <-- chnage to view from correct song to showing who is up next.
        isLeader: data === nickname,
      });
    });

    on('stopRound', (data) => {
      this.setState({
        correctSong: data.selectedSong,
      });
    });

    on('startRound', (data) => {
      const { score, guessTimer } = this.state;
      this.setState({
        correctSong: false,
        guessed: false,
        guessTimer: data / 1000,
        oldScore: score,
      });

      clearInterval(this.guessInterval);
      this.guessInterval = undefined;

      this.guessInterval = setInterval(() => {
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

    on('hostPlaySong', data => this.setState({
      songToPlay: data,
    }));

    on('playingSong', data => this.setState({
      playing: data,
    }));
  }

  startGame() {
    emit('hostStartGame', this.state);
  }

  resetGame() {
    emit('hostResetGame', this.state);
  }

  joinAsPlayer(nick, room) {
    const { nickname } = this.state;
    if (!nick.length) {
      return;
    }

    if (nickname) {
      return;
    }

    // TODO get players first to avoid duplicates;

    this.setState(
      {
        nickname: nick,
      },
      () => emit('join', { nick, roomName: room }),
    );
  }

  joinAsHost() {
    this.setState(
      {
        isHost: true,
        hasHost: true,
      },
      () => emit('hostJoin', Math.floor(Math.random() * (9999 - 1000) + 1000).toString()),
    );
  }

  guess(uri) {
    const { guessed, nickname } = this.state;
    if (!guessed) {
      this.setState(
        {
          guessed: true,
        },
        () => emit('guess', { uri, room: this.state, nickname }),
      );
    }
  }

  sendTime(time) {
    this.setState({ timer: time }, () => emit('timer', time));
  }

  selectSong(song) {
    const { room } = this.state;
    this.setState(
      {
        selectedSong: true,
      },
      () => emit('selectedSong', { song, room }),
    );
  }

  render() {
    const {
      loading,
      isLeader,
      isHost,
      room,
      hasHost,
      nickname,
      started,
      score,
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
          room={room}
          isHost={isHost}
          hasHost={hasHost}
          nickname={nickname}
          started={started}
          score={score}
          guessTimer={guessTimer}
          isLeader={isLeader}
          correctSong={correctSong}
          songToPlay={songToPlay}
          guessed={guessed}
          playing={playing}
          onStartGame={() => this.startGame()}
          onJoinAsPlayer={(n, r) => this.joinAsPlayer(n, r)}
          onJoinAsHost={() => this.joinAsHost()}
          onGuess={uri => this.guess(uri)}
          onSelectSong={song => this.selectSong(song)}
          onChangeTimer={time => this.sendTime(time)}
        />
      </Layout>
    );
  }
}

export default App;
