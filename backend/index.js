const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
require('dotenv').load();

const luckyNames = require('./names');

let rooms = [];
const timeouts = {};

const searchApi = require('./searchApi');
const spotifyPlayerApi = require('./playerApi');

app.get('/callback', (req, res) => {
  console.log(req);
});

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/auth/:code', (req, res) => {
  res.send({ code: req.params.code });
});

app.get('/search/:name', (req, res) => {
  searchApi
    .searchTracks(req.params.name, {
      market: 'SE',
    })
    .then(
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

    searchApi
      .getRecommendations({
        /* min_danceability: averageDanceability-0.2, max_danceability: averageDanceability+0.2,
       min_energy: averageEnergy-0.2, max_energy: averageEnergy+0.2, */
        seed_tracks: [songArray],
      })
      .then(rec => {
        res.send(rec);
      })
      .catch(e => {
        console.log('77: ', e);
      });
  }
});

app.use('/', express.static('../frontend/build'));

http.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`);
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
  let leader = room.players.shift();
  if (room.leader && room.leader.nickname === leader.nickname) {
    room.players.push(leader);
    leader = room.players.shift();
  }
  while (!leader.active) {
    room.players.push(leader);
    leader = room.players.shift();
  }
  room.players.push(leader);
  if (!leader.connected) {
    clearTimeout(timeouts[room.name].players[leader.nickname]);
    timeouts[room.name].players[leader.nickname] = setTimeout(
      (player, room) => {
        player.active = false;
        pickLeader(room);
        io.to(room.name).emit('playerDisconnected', leader);
        console.log(`${leader.nickname} disconnected from ${room.name}`);
      },
      room.leaderTime,
      leader,
      room,
    );
    io.to(room.name).emit('leaderTimeout', room.leaderTime);
  }
  room.leader = leader;
  io.to(room.name).emit('leader', leader);
  io.to(room.name).emit('updatePlayers', room.players);
  console.log('pickleader', room.name);
}

function startChoose(room) {
  const { gamestate } = room;
  console.log('startChoose', room.name);
  if (gamestate === 'lobby' || gamestate === 'finished') {
    room.gamestate = 'choose';
    room.started = true;
    room.selectedSong = null;
    pickLeader(room);
    io.to(room.name).emit('startChoose', {
      gamestate: room.gamestate,
    });
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
    io.to(room.name).emit('stopRound', {
      correctSong: selectedSong,
      gamestate: room.gamestate,
    });
    setTimeout(applyUpdates, displayCorrectTime / 2, room);
    setTimeout(startChoose, displayCorrectTime, room);
  }
}

function startRound(room) {
  if (room.gamestate === 'choose') {
    room.gamestate = 'midgame';
    timeouts[room.name].round = setTimeout(stopRound, room.roundTime, room);
    room.roundStartTime = new Date();
    io.to(room.name).emit('startRound', {
      roundTime: room.roundTime,
      gamestate: room.gamestate,
    });
  }
}

function analyzeSong(id, room) {
  searchApi.getAudioFeaturesForTrack(id).then(
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

function calculatePoints(roundStartTime, roundTime, minPoints, maxPoints) {
  const current = new Date();
  const div = maxPoints / (maxPoints - minPoints);
  const diff = current.getTime() - roundStartTime.getTime();
  const roundScore = Math.round(maxPoints * (1 - diff / roundTime / div));
  return roundScore;
}

// -------------- IO - Events --------------

io.on('connection', socket => {
  socket.on('lucky', name => {
    const foundRoom = rooms.find(r => r.name === name);
    if (foundRoom) {
      let foundName = false;
      const names = luckyNames;
      while (!foundName && names.length > 0) {
        const index = Math.floor(Math.random() * (names.length - 1));
        const nickname = names[index];
        const existingPlayer = foundRoom.players.find(player => player.nickname === nickname);
        if (existingPlayer) {
          names.splice(index, index);
        } else {
          foundName = true;
          socket.emit('lucky', nickname);
        }
      }
    }
  });
  socket.on('join', data => {
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
      player = {
        nickname,
        active: true,
        connected: true,
        score: 0,
        scoreUpdate: 0,
        sessionId,
      };
      foundRoom.players.push(player);
      io.to(foundRoom.name).emit('playerJoined', player);
    } else {
      console.log('join existing', nickname);
      clearTimeout(timeouts[name].players[nickname]);
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
    }
    foundRoom.correctSong = foundRoom.selectedSong;
    socket.emit('joinSuccess', {
      nickname,
      room: foundRoom,
    });
    if (foundRoom && foundRoom.gamestate === 'lobby') {
      startChoose(foundRoom);
    }
  });

  socket.on('hostJoin', ({ uri }) => {
    let creatingName = true;
    let name;
    while (creatingName) {
      name = Math.floor(Math.random() * (9999 - 1000) + 1000);
      creatingName = rooms.find(r => r.name === name);
    }
    const redirectUri = `http://localhost:8888/callback`;
    const auth = spotifyPlayerApi.getAuthUri(redirectUri, { name, user: socket });
    socket.emit('hostJoin', auth);

    return;
    const roundTime = 30000;
    const leaderTime = 10000;
    const displayCorrectTime = 10000;

    timeouts[name] = {
      round: {},
      players: {},
    };
    socket.name = name;
    const room = {
      name: socket.name,
      spotifyPlayer: undefined,
      roundTime,
      leaderTime,
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
      const roundScore = calculatePoints(roundStartTime, roundTime, foundRoom.minPoints, foundRoom.maxPoints);
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
      foundRoom.leaderTime = settings.leaderTime * 1000;
      foundRoom.maxPoints = settings.maxPoints;
      foundRoom.minPoints = settings.minPoints;
      // TODO send settings
    }
  });

  socket.on('kick', ({ nickname, name }) => {
    const foundRoom = rooms.find(r => r.name === name);
    foundRoom.players = foundRoom.players.filter(p => p.nickname !== nickname);
    if (foundRoom.leader.nickname === nickname) {
      pickLeader(foundRoom);
    }
    io.to(name).emit('kick', nickname);
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
        timeouts[foundRoom.name].players[player.nickname] = setTimeout(
          (player, room) => {
            player.active = false;
            io.to(room.name).emit('playerDisconnected', player);
            console.log(`${player.nickname} disconnected from ${room.name}`);
          },
          foundRoom.roundTime,
          player,
          foundRoom,
        );
      }
    }
  });
});
