const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').load();
// credentials are optional
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: ''
});

const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const rooms = [];
const timeouts = {};

function getToken() {
  spotifyApi.clientCredentialsGrant().then(
    data => {
      console.log(`The access token expires in ${data.body.expires_in}`);
      console.log(`The access token is ${data.body.access_token}`);

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body.access_token);
    },
    err => {
      console.log('Something went wrong when retrieving an access token', err);
    }
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
    data => {
      res.send(data);
    },
    err => {
      console.error(err);
    }
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
        seed_tracks: [songArray]
      })
      .then(rec => {
        res.send(rec);
      })
      .catch(e => {
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
  room.selectedSong = undefined;
  room.gamestate = 'pregame';
  room.totalPoints = 0;
  room.energyArray = [];
  room.danceabilityArray = [];
  room.songArray = [];
  sendStatus(room);
}
function applyUpdates(room) {
  console.log('before', room.players);
  room.players.forEach(player => {
    player.score += player.scoreUpdate;
    player.scoreUpdate = 0;
  });
  console.log('adfter', room.players);
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

function pickLeader(room) {
  console.log('pickleader', room);
  const leader = room.players
    .filter(player => player.active)
    .sort((first, second) => first.leader / first.rounds - second.leader / second.rounds)
    .find(p => p);
  leader.leader += 1;
  room.leader = leader;
  sendLeader(room.name, leader);
}

function startChoose(room) {
  const { gamestate } = room;
  console.log('startChoose', room.name, gamestate);
  if (gamestate === 'lobby' || gamestate === 'finished') {
    room.gamestate = 'choose';
    room.started = true;
    pickLeader(room);
    sendStatus(room);
  }
}

function stopRound(room) {
  console.log('stopRound', room);
  const { leader, players, displayCorrectTime, selectedSong, totalPoints } = room;
  if (room.gamestate === 'midgame') {
    clearTimeout(timeouts[room.name]);
    const leaderScore = Math.round(totalPoints / (players.length - 1));
    if (leaderScore > 0) {
      leader.scoreUpdate = leaderScore;
    } else {
      leader.scoreUpdate = -1 * room.penalty;
    }
    room.totalPoints = 0;
    room.guesses = 0;
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
    room.players.forEach(player => (player.rounds += 1));
    timeouts[room.name] = setTimeout(stopRound, room.roundTime, room);
    room.roundStartTime = new Date();
    io.to(room.name).emit('startRound', room);
  }
}

function analyzeSong(id, room) {
  spotifyApi.getAudioFeaturesForTrack(id).then(
    data => {
      room.danceabilityArray.push(data.body.danceability);
      room.energyArray.push(data.body.energy);
      room.songArray.push(id);
    },
    err => {
      console.error(err);
    }
  );
}

function compareSong(s1, s2) {
  const re = /{remix|remaster| -.*|}/gi;
  const clean1 = s1
    .toLowerCase()
    .replace(re, '')
    .trim();
  const clean2 = s2
    .toLowerCase()
    .replace(re, '')
    .trim();
  return clean1 === clean2;
}

function compareArtist(a1, a2) {
  const subsetOf = (s1, s2) => s1.every(e1 => s2.includes(e1));
  const names1 = a1.map(artist => artist.name);
  const names2 = a2.map(artist => artist.name);
  return subsetOf(names1, names2) || subsetOf(names2, names1);
}

// -------------- IO - Events --------------

io.on('connection', socket => {
  socket.on('join', data => {
    console.log('join');
    const { nickname, name } = data;
    const foundRoom = rooms.find(r => r.name === name);
    const player = foundRoom ? foundRoom.players.find(p => p.nickname === nickname) : null;
    if (!foundRoom) {
      socket.emit('roomNotFound');
    } else if (player && player.active) {
      socket.emit('playerAlreadyExists');
    } else if (player && !player.active) {
      player.active = true;
      socket.nickname = nickname;
      socket.name = name;
      socket.join(name);
      sendStatus(foundRoom);
      socket.emit('joined', nickname);
    } else {
      foundRoom.players.push({ nickname, active: true, score: 0, scoreUpdate: 0, rounds: 1, leader: 0 });
      socket.nickname = nickname;
      socket.name = name;
      socket.join(name);
      sendStatus(foundRoom);
      socket.emit('joined', nickname);
    }
    if (foundRoom && foundRoom.gamestate === 'lobby' && foundRoom.players.length > 1) {
      startChoose(foundRoom);
    }
  });

  socket.on('hostJoin', () => {
    const roundTime = 30000;
    const displayCorrectTime = 10000;
    socket.host = true;
    let creatingName = true;
    let name;
    while (creatingName) {
      name = Math.floor(Math.random() * (9999 - 1000) + 1000);
      creatingName = rooms.find(r => r.name === name);
    }
    socket.name = name;
    const room = {
      name: socket.name,
      roundTime,
      displayCorrectTime,
      players: [],
      guesses: 0,
      penalty: 0,
      gamestate: 'lobby',
      totalPoints: 0,
      energyArray: [],
      danceabilityArray: [],
      songArray: []
    };
    console.log('hostJoin', socket.name);
    rooms.push(room);
    socket.join(socket.name);
    sendStatus(room);
  });

  socket.on('guess', data => {
    const { song: guessedSong, name, nickname } = data;
    const foundRoom = rooms.find(r => r.name === name);
    const { selectedSong, roundStartTime, roundTime, players } = foundRoom;
    if (guessedSong.uri === selectedSong.uri || (compareArtist(selectedSong.artists, guessedSong.artists) && compareSong(selectedSong.name, guessedSong.name))) {
      const current = new Date();
      const diff = current.getTime() - roundStartTime.getTime();
      const roundScore = Math.round((roundTime - diff) / 1000);
      const player = players.find(player => player.nickname === nickname);
      player.scoreUpdate = roundScore;
      foundRoom.totalPoints += roundScore;
      console.log('correct');
    } else {
      const compA = compareArtist(selectedSong.artists, guessedSong.artists);
      const compS = compareSong(selectedSong.name, guessedSong.name);
      console.log('fault: artist:', compA, '  song:', compS);
    }
    foundRoom.guesses += 1;
    sendStatus(foundRoom);
    if (foundRoom.guesses >= players.filter(player => player.active).length - 1) {
      stopRound(foundRoom);
    }
  });

  socket.on('selectedSong', data => {
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
  socket.on('settings', ({ settings, name }) => {
    const foundRoom = rooms.find(r => r.name === name);
    if (foundRoom) {
      foundRoom.roundTime = settings.time * 1000;
      foundRoom.penalty = settings.penalty;
      sendStatus(foundRoom);
    }
  });
  socket.on('kick', ({ player, name }) => {
    const foundRoom = rooms.find(r => r.name === name);
    console.log(player);
    foundRoom.players = foundRoom.players.filter(p => p.nickname !== player.nickname);
    io.to(name).emit('kick', player.nickname);
    if (foundRoom.leader.nickname === player.nickname) {
      pickLeader(foundRoom);
    }
    sendStatus(foundRoom);
  });
  socket.on('reconnected', ({ nickname, name }) => {
    const foundRoom = rooms.find(r => r.name === name);
    if (foundRoom) {
      // TODO: handle reconnect
    }
  });

  socket.on('disconnect', () => {
    console.log('disc');
    const foundRoom = rooms.find(r => r.name === socket.name);
    if (foundRoom) {
      if (socket.host) {
        resetRoom(foundRoom);
      }
      const { leader, players } = foundRoom;
      if (leader && leader.nickname === socket.nickname) {
        pickLeader(foundRoom);
      }
      const player = players.find(player => player.nickname === socket.nickname);
      if (player) {
        player.active = false;
      }
      console.log(player, socket.nickname);
      sendStatus(foundRoom);
      console.log(`${socket.nickname} disconnected`);
    }
  });
});
