const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').load();
// credentials are optional
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: '',
});

const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const rooms = [];
const timeouts = {};

function getToken() {
  spotifyApi.clientCredentialsGrant().then(
    (data) => {
      console.log(`The access token expires in ${data.body.expires_in}`);
      console.log(`The access token is ${data.body.access_token}`);

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body.access_token);
    },
    (err) => {
      console.log('Something went wrong when retrieving an access token', err);
    },
  );
}

getToken();

// Refresh token before 1h.
setInterval(getToken, 3598000);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/search/:name', (req, res) => {
  spotifyApi.searchTracks(req.params.name, { market: 'SE' }).then(
    (data) => {
      res.send(data);
    },
    (err) => {
      console.error(err);
    },
  );
});
let averageDanceability = 0.5;
let averageEnergy = 0.5;
// let deleteTemp = true;

app.get('/recommendations/:name', (req, res) => {
  const foundRoom = rooms.find(r => r.name === req.params.name);
  if (foundRoom) {
    const { songArray, energyArray, danceabilityArray } = foundRoom;
    let collectedDanceability = 0;
    let collectedEnergy = 0;

    for (let i = 0; i < energyArray.length; i += 1) {
      collectedEnergy += energyArray[i];
      averageEnergy = collectedEnergy / energyArray.length;
    }
    for (let i = 0; i < danceabilityArray.length; i += 1) {
      collectedDanceability += danceabilityArray[i];
      averageDanceability = collectedDanceability / danceabilityArray.length;
    }
    if (songArray.length === 0) {
      songArray.push('5QjJgPU8AJeickx34f7on6');
    }
    if (averageDanceability > 0.8) {
      averageDanceability = 0.8;
    }
    if (averageEnergy > 0.8) {
      averageEnergy = 0.8;
    }
    console.log(songArray);
    spotifyApi
      .getRecommendations({
        /* min_danceability: averageDanceability-0.2, max_danceability: averageDanceability+0.2,
       min_energy: averageEnergy-0.2, max_energy: averageEnergy+0.2, */
        seed_tracks: [songArray],
      })
      .then((rec) => {
        res.send(rec);
      })
      .catch((e) => {
        console.log(e);
      });
  }
});

app.use('/', express.static('frontend/build'));

http.listen(8888, () => {
  console.log('Example app listening on port 8888!');
});

// --------------------------- Functions ---------------------------------

function sendStatus(room) {
  io.to(room.name).emit('status', room);
  console.log('sendStatus', room.name);
}
function resetRoom(room) {
  room.players = [];
  room.leader = undefined;
  room.guesses = 0;
  room.scores = {};
  room.scoreUpdates = {};
  room.selectedSong = undefined;
  room.gamestate = 'pregame';
  room.totalPoints = 0;
  room.allowReconnect = false;
  room.energyArray = [];
  room.danceabilityArray = [];
  room.songArray = [];
  sendStatus(room);
}
function applyUpdates(room) {
  Object.entries(room.scoreUpdates).forEach(([nick, score]) => {
    room.scores[nick] += score;
  });
  room.scoreUpdates = {};
  sendStatus(room);
}

function playSong(song, name) {
  console.log('playSong');
  io.to(name).emit('hostPlaySong', song.uri);
  io.to(name).emit('playing', song);
}

function sendLeader(name, leader) {
  io.to(name).emit('leader', leader);
  console.log('send leader', leader);
}

function clearLeader(name) {
  io.to(name).emit('leader', null);
  console.log('clear leader');
}

function pickLeader(room) {
  const { players } = room;
  const leader = players.shift();
  room.leader = leader;
  players.push(leader);
  sendLeader(room.name, leader);
}

function startChoose(room) {
  const { gamestate } = room;
  console.log('startChoose', room.name, gamestate);
  if (gamestate === 'lobby' || gamestate === 'finished') {
    room.gamestate = 'choose';
    pickLeader(room);
    sendStatus(room);
  }
}

function stopRound(room) {
  console.log('stopRound');
  const { leader, scoreUpdates, players, displayCorrectTime, selectedSong, totalPoints } = room;
  if (room.gamestate === 'midgame') {
    clearTimeout(timeouts[room.name]);
    const leaderScore = Math.round(totalPoints / (players.length - 1));
    if (leaderScore > 0) {
      scoreUpdates[leader] = leaderScore;
    }
    room.totalPoints = 0;
    room.guesses = 0;
    clearLeader(room.name);
    room.gamestate = 'finished';
    sendStatus(room);
    io.to(room.name).emit('stopRound', { selectedSong });
    setTimeout(applyUpdates, displayCorrectTime / 2, room);
    setTimeout(startChoose, displayCorrectTime, room);
  }
}

function startRound(room) {
  if (room.gamestate === 'choose') {
    room.gamestate = 'midgame';
    console.log('startRound', room.roundTime);
    timeouts[room.name] = setTimeout(stopRound, room.roundTime, room);

    room.roundStartTime = new Date();
    io.to(room.name).emit('startRound', room);
  }
}

function analyzeSong(id, room) {
  spotifyApi.getAudioFeaturesForTrack(id).then(
    (data) => {
      room.danceabilityArray.push(data.body.danceability);
      room.energyArray.push(data.body.energy);
      room.songArray.push(id);
    },
    (err) => {
      console.error(err);
    },
  );
}

function addPlayer(room, nick, score) {
  room.players.push(nick);
  console.log(nick);
  room.scores[nick] = score;
  if (room.leader) {
    sendLeader(room);
  }
  sendStatus(room);
}
// -------------- IO - Events --------------

io.on('connection', (socket) => {
  socket.on('join', (data) => {
    console.log('join');
    const { nick, name } = data;
    const foundRoom = rooms.find(r => r.name === name);
    if (!foundRoom) {
      socket.emit('roomNotFound');
    } else if (foundRoom.players.includes(nick)) {
      socket.emit('playerAlreadyExists');
    } else {
      foundRoom.players.push(nick);
      foundRoom.scores[nick] = 0;
      socket.nickname = nick;
      socket.name = name;
      socket.join(name);
      if (foundRoom.leader) {
        sendLeader(foundRoom);
      }
      sendStatus(foundRoom);
      socket.emit('joined', nick);
    }
  });

  socket.on('hostJoin', (name) => {
    console.log('hostJoin', name);

    const roundTime = 30000;
    const displayCorrectTime = 10000;
    const room = {
      name,
      roundTime,
      displayCorrectTime,
      players: [],
      guesses: 0,
      scores: {},
      scoreUpdates: {},
      gamestate: 'lobby',
      totalPoints: 0,
      allowReconnect: false,
      energyArray: [],
      danceabilityArray: [],
      songArray: [],
    };
    rooms.push(room);
    socket.join(name);
    sendStatus(room);
  });

  socket.on('guess', (data) => {
    const { uri, name, nickname } = data;
    const foundRoom = rooms.find(r => r.name === name);
    const { selectedSong, scoreUpdates, roundStartTime, roundTime, players } = foundRoom;
    if (selectedSong.uri === uri) {
      const current = new Date();
      const diff = current.getTime() - roundStartTime.getTime();
      const roundScore = Math.round((roundTime - diff) / 1000);
      scoreUpdates[nickname] = roundScore;
      foundRoom.totalPoints += roundScore;
      console.log('correct');
    }
    foundRoom.guesses += 1;
    sendStatus(foundRoom);
    if (foundRoom.guesses >= players.length - 1) {
      stopRound(foundRoom);
    }
  });

  socket.on('selectedSong', (data) => {
    const { song, name } = data;
    const foundRoom = rooms.find(r => r.name === name);
    if (foundRoom) {
      if (foundRoom.songArray.length === 1 && foundRoom.songArray[0] === '5QjJgPU8AJeickx34f7on6') {
        foundRoom.songArray = [];
      }
      if (foundRoom.songArray.length > 3) {
        foundRoom.songArray.splice(0, 1);
      }
      console.log('got selectedSong');
      foundRoom.selectedSong = song;
      playSong(song, foundRoom.name);
      startRound(foundRoom);
      analyzeSong(song.id, foundRoom);
    }
  });

  socket.on('hostStartGame', (name) => {
    console.log('got hostStartGame');
    const foundRoom = rooms.find(r => r.name === name);
    if (foundRoom) {
      startChoose(foundRoom);
    }
  });

  socket.on('hostReset', (name) => {
    console.log('got hostReset');
    const foundRoom = rooms.find(r => r.name === name);
    if (foundRoom) {
      resetRoom(foundRoom);
    }
  });

  socket.on('reconnected', ({ nickname, name, score }) => {
    const foundRoom = rooms.find(r => r.name === name);
    if (foundRoom) {
      if (foundRoom.allowReconnect) {
        console.log(`reconnected ${nickname} with ${score}`);
        addPlayer(foundRoom, nickname, score);
      } else {
        console.log(`Didnt allow reconnect from ${nickname}`);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('disc');
    const foundRoom = rooms.find(r => r.name === socket.name);
    if (foundRoom) {
      const { leader, players } = foundRoom;
      foundRoom.allowReconnect = true;
      if (leader === socket.nickname) {
        pickLeader(foundRoom);
      }
      foundRoom.players = players.filter(player => player !== socket.nickname);

      if (players.length < 2) {
        resetRoom(foundRoom);
      }

      delete foundRoom.scores[socket.nickname];
      delete foundRoom.scoreUpdates[socket.nickname];
      sendStatus(foundRoom);
      console.log(`${socket.nickname} disconnected`);
    }
  });
});
