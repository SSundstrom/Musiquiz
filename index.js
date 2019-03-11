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

let rooms = [];
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
    data => {
      res.send(data);
    },
    err => {
      console.error(err);
    },
  );
});
let averageDanceability = 0.5;
let averageEnergy = 0.5;
// let deleteTemp = true;

app.get('/recommendations/:name', (req, res) => {
  const name = parseInt(req.params.name, 10);
  const foundRoom = rooms.find(r => r.name === name);
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

    spotifyApi
      .getRecommendations({
        /* min_danceability: averageDanceability-0.2, max_danceability: averageDanceability+0.2,
       min_energy: averageEnergy-0.2, max_energy: averageEnergy+0.2, */
        seed_tracks: [songArray],
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

function resetRoom(room) {
  rooms = rooms.filter(r => r.name !== room.name);
  io.to(room.name).emit('reset');
}
function applyUpdates(room) {
  room.players.forEach(player => {
    player.score += player.scoreUpdate;
    player.scoreUpdate = 0;
    player.guessed = false;
  });
  io.to(room.name).emit('updatePlayers', room.players);
}

function playSong(song, name) {
  console.log('playSong');
  io.to(name).emit('hostPlaySong', song.uri);
}

function pickLeader(room) {
  const leader = room.players
    .filter(player => player.active)
    .sort((first, second) => first.leader / first.rounds - second.leader / second.rounds)
    .find(p => p);
  leader.leader += 1;
  room.leader = leader;
  io.to(room.name).emit('leader', leader);
  console.log('pickleader', room.name);
  // if picked leader has disconnected recently give them 30 seconds to reconnect before picking new leader.
  // if (!leader.connected) {
  //   timeouts[room.name].players[leader.nickname] = setTimeout(
  //     ({ leader, room }) => {
  //       leader.active = false;
  //       pickLeader(room);
  //       io.to(room.name).emit('playerDisconnected', leader);
  //       console.log(`${leader.nickname} disconnected from ${room.name}`);
  //     },
  //     30000,
  //     { leader, room },
  //   );
  // }
}

function startChoose(room) {
  const { gamestate } = room;
  console.log('startChoose', room.name);
  if (gamestate === 'lobby' || gamestate === 'finished') {
    room.gamestate = 'choose';
    room.started = true;
    room.selectedSong = null;
    pickLeader(room);
    io.to(room.name).emit('startChoose', { gamestate: room.gamestate });
  }
}

function stopRound(room) {
  console.log('stopRound', room.name);
  const { leader, players, displayCorrectTime, selectedSong, totalPoints } = room;
  if (room.gamestate === 'midgame') {
    clearTimeout(timeouts[room.name].round);
    const leaderScore = Math.round(totalPoints / (players.length - 1));
    if (leaderScore > 0) {
      leader.scoreUpdate = leaderScore;
    } else {
      leader.scoreUpdate = -1 * room.penalty;
    }
    room.totalPoints = 0;
    room.guesses = 0;
    room.gamestate = 'finished';
    room.guessTimer = 0;
    io.to(room.name).emit('stopRound', { correctSong: selectedSong, gamestate: room.gamestate });
    setTimeout(applyUpdates, displayCorrectTime / 2, room);
    setTimeout(startChoose, displayCorrectTime, room);
  }
}

function startRound(room) {
  if (room.gamestate === 'choose') {
    room.gamestate = 'midgame';
    // start timeout conter for players
    // room.players.forEach(player => {
    //   if (!player.connected) {
    //     timeouts[room.name].players[player.nickname] = setTimeout(
    //       ({ player, room }) => {
    //         player.active = false;
    //         io.to(room.name).emit('playerDisconnected', player);
    //         console.log(`${player.nickname} disconnected from ${room.name}`);
    //       },
    //       120000,
    //       { player, room },
    //     );
    //   }
    //   player.rounds += 1;
    // });
    room.players.forEach(player => (player.rounds += 1));
    timeouts[room.name].round = setTimeout(stopRound, room.roundTime, room);
    room.roundStartTime = new Date();
    io.to(room.name).emit('startRound', { roundTime: room.roundTime, gamestate: room.gamestate });
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
    },
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

function calculateTime(roundStartTime, roundTime) {
  const current = new Date();
  const diff = current.getTime() - roundStartTime.getTime();
  const roundScore = Math.round((roundTime - diff) / 1000);
  return roundScore;
}

// -------------- IO - Events --------------

io.on('connection', socket => {
  socket.on('join', data => {
    console.log('join', data);
    const { nickname, name, sessionId } = data;
    const foundRoom = rooms.find(r => r.name === name);
    const foundPlayer = foundRoom ? foundRoom.players.find(p => p.nickname === nickname) : null;
    if (!foundRoom) {
      return socket.emit('roomNotFound');
    }
    if (foundPlayer && foundPlayer.sessionId !== sessionId) {
      return socket.emit('playerAlreadyExists');
    }
    if (!foundPlayer) {
      console.log('join new', nickname);
      player = { nickname, active: true, connected: true, score: 0, scoreUpdate: 0, rounds: 1, leader: 0, sessionId };
      foundRoom.players.push(player);
      io.to(foundRoom.name).emit('playerJoined', player);
    } else {
      console.log('join existing', nickname);
      //clearTimeout(timeouts[name].players[nickname]);
      foundPlayer.sessionId = sessionId;
      foundPlayer.active = true;
      foundPlayer.connected = true;
      io.to(foundRoom.name).emit('playerJoined', foundPlayer);
    }
    socket.nickname = nickname;
    socket.name = name;
    socket.join(name);
    if (foundRoom.gamestate === 'midgame') {
      foundRoom.guessTimer = calculateTime(foundRoom.roundStartTime, foundRoom.roundTime);
    } else if (foundRoom.gamestate === 'finished') {
      foundRoom.correctSong = foundRoom.selectedSong;
    }
    socket.emit('joinSuccess', { nickname, foundRoom });
    if (foundRoom && foundRoom.gamestate === 'lobby') {
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
    timeouts[name] = { round: {}, players: {} };
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
      songArray: [],
    };
    rooms.push(room);
    socket.join(socket.name);
    socket.emit('hostJoin', room);
  });

  socket.on('guess', data => {
    const { song: guessedSong, name, nickname } = data;
    const foundRoom = rooms.find(r => r.name === name);
    const { selectedSong, roundStartTime, roundTime, players } = foundRoom;
    const player = players.find(player => player.nickname === nickname);
    if (
      guessedSong.uri === selectedSong.uri ||
      (compareArtist(selectedSong.artists, guessedSong.artists) && compareSong(selectedSong.name, guessedSong.name))
    ) {
      const roundScore = calculateTime(roundStartTime, roundTime);
      player.scoreUpdate = roundScore;
      player.correct = true;
      foundRoom.totalPoints += roundScore;
    } else {
      player.correct = false;
    }
    player.guessed = true;
    io.to(foundRoom.name).emit('playerGuess', player);
    const activePlayers = players.filter(player => player.active);
    const guessesWanted = activePlayers.length - 1;
    const guesses = activePlayers.filter(player => player.guessed).length;
    if (guesses >= guessesWanted) {
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
      //TODO send settings
    }
  });

  socket.on('kick', ({ player, name }) => {
    const foundRoom = rooms.find(r => r.name === name);
    foundRoom.players = foundRoom.players.filter(p => p.nickname !== player.nickname);
    if (foundRoom.leader.nickname === player.nickname) {
      pickLeader(foundRoom);
    }
    io.to(name).emit('kick', player.nickname);
  });

  socket.on('disconnect', () => {
    console.log('disonnect', socket.nickname);
    const foundRoom = rooms.find(r => r.name === socket.name);
    if (foundRoom) {
      if (socket.host) {
        resetRoom(foundRoom);
      }
      const { players } = foundRoom;
      const player = players.find(player => player.nickname === socket.nickname);
      if (player) {
        player.connected = false;
      }
    }
  });
});
