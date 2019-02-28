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
      const { nickname, scores } = this.state;
      if (this) {
        if (nickname) {
          console.log(`reconnected ${nickname}${scores[nickname]}`);
          emit('reconnected', {
            nickname,
            score: scores[nickname],
          });
        } else {
          console.log('Connected');
        }
      } else {
        console.log('Connected');
      }
    });

    on('disconnect', () => {
      const { nickname, scores, scoreUpdates } = this.state;
      if (nickname in scoreUpdates) {
        scores[nickname] += scoreUpdates[nickname];
      }
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
        isLeader: data == nickname,
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

  startGame() {
    const { name } = this.state;
    emit('hostStartGame', name);
  }

  resetGame() {
    const { name } = this.state;
    emit('hostResetGame', name);
  }

  // eslint-disable-next-line class-methods-use-this
  joinAsPlayer(nick, name) {
    if (!nick.length) {
      return;
    }
    emit('join', { nick, name });
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
    const { guessed, nickname, name } = this.state;
    if (!guessed) {
      this.setState(
        {
          guessed: true,
        },
        () => emit('guess', { uri, name, nickname }),
      );
    }
  }

  sendTime(time) {
    this.setState({ timer: time }, () => emit('timer', time));
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
      scores,
      leader,
      scoreUpdates,
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
          scores={scores}
          scoreUpdates={scoreUpdates}
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
