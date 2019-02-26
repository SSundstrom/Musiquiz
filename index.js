const SpotifyWebApi = require('spotify-web-api-node');
const ds = require('datastructures-js');

// credentials are optional
const spotifyApi = new SpotifyWebApi({
  clientId: 'c11d380eadd04921a083d5637c108f8c',
  clientSecret: 'f8db5475fa7748e28203dd0ebac181e4',
  redirectUri: '',
});

const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

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
const energyArray = [];
const danceabilityArray = [];
let songArray = [];
// let deleteTemp = true;

app.get('/recommendations', (req, res) => {
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
});

app.use('/', express.static('frontend/build'));

http.listen(8888, () => {
  console.log('Example app listening on port 8888!');
});

// --------------------------- Functions ---------------------------------
const rooms = [];

function sendStatus(room) {
  io.to(room.name).emit('status', room);
  console.log('sendStatus', room.name);
}
function resetRoom(room) {
  room.playerList = ds.linkedList();
  room.leader = undefined;
  room.guesses = 0;
  room.scores = {};
  room.scoreUpdates = {};
  room.selectedSong = undefined;
  room.gamestate = 'pregame';
  room.totalPoints = 0;
  room.allowReconnect = false;
  sendStatus(room);
}
function applyUpdates(room) {
  let { scoreUpdates } = room;
  const { scores } = room;
  scoreUpdates.forEach((nick) => {
    scores[nick] += scoreUpdates[nick];
  });

  scoreUpdates = {};
  sendStatus(room);
}

function playSong(data) {
  const { uri, room } = data;
  io.to(room).emit('hostPlaySong', uri);
  io.to(room).emit('playing', room.selectedSong);
  console.log('playSong');
}

function sendLeader(room) {
  io.in(room).emit('leader', room.leader);
  console.log('leader');
}

function clearLeader(room) {
  io.to(room).emit('leader', undefined);
  console.log('leader');
}

function pickLeader(room) {
  const node = room.playerList.findFirst();
  let { leader } = room;
  if (node) {
    leader = node.getValue();
    room.playerList.removeFirst();
    room.playerList.addLast(leader);
  }
  sendLeader(room.name);
}

function startChoose(room) {
  console.log('startChoose');
  let { gamestate } = room;
  if (gamestate === 'lobby' || gamestate === 'finished') {
    gamestate = 'choose';
    pickLeader(room);
    sendLeader(room);
    sendStatus(room);
  }
}

function stopRound(room) {
  console.log('stopRound');
  let { totalPoints, guesses, gamestate } = room;
  const { leader, scoreUpdates, playerList, displayCorrectTime, selectedSong } = room;
  if (gamestate === 'midgame') {
    clearTimeout(room.timeout);
    const leaderScore = Math.round(totalPoints / (playerList.count() - 1));
    if (leaderScore > 0) {
      scoreUpdates[leader] = leaderScore;
    }
    totalPoints = 0;
    guesses = 0;
    clearLeader(room);
    gamestate = 'finished';
    sendStatus(room);
    io.to(room).emit('stopRound', { selectedSong });
    setTimeout(applyUpdates, displayCorrectTime / 2);
    setTimeout(startChoose, displayCorrectTime);
  }
}

function startRound(room) {
  console.log('startRound');
  let { gamestate, timeout, roundStartTime } = room;
  const { roundTime } = room;
  if (gamestate === 'choose') {
    gamestate = 'midgame';
    io.to(room).emit('startRound', roundTime);
    timeout = setTimeout(stopRound, roundTime);
    roundStartTime = new Date();
  }
}

function analyzeSong(id) {
  spotifyApi.getAudioFeaturesForTrack(id).then(
    (data) => {
      danceabilityArray.push(data.body.danceability);
      energyArray.push(data.body.energy);
      songArray.push(id);
    },
    (err) => {
      console.error(err);
    },
  );
}

function toArray(queue) {
  const retArray = [];
  if (queue) {
    let tmp = queue.findFirst();
    while (tmp) {
      retArray.push(tmp.getValue());
      tmp = tmp.getNext();
    }
  }
  return retArray;
}
function addPlayer(room, nick, score) {
  room.playerList.addLast(nick);
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
    const { nick, roomName } = data;
    const foundRoom = rooms.find(r => r.name === roomName);
    if (foundRoom) {
      foundRoom.playerList.addLast(nick);
      foundRoom.players = toArray(foundRoom.playerList);
      socket.nickname = nick;
      socket.join(roomName);
      sendStatus(foundRoom);
    } else {
      socket.emit('roomNotFound');
    }
  });

  socket.on('hostJoin', (name) => {
    console.log('hostJoin', name);
    let roundStartTime;
    let timeout;
    let leader;
    let selectedSong;
    const roundTime = 30000;
    const displayCorrectTime = 10000;
    const room = {
      name,
      leader,
      selectedSong,
      playerList: ds.linkedList(),
      players: [],
      guesses: 0,
      scores: {},
      scoreUpdates: {},
      gamestate: 'lobby',
      totalPoints: 0,
      allowReconnect: false,
      roundStartTime,
      timeout,
      roundTime,
      displayCorrectTime,
    };
    rooms.push(room);
    socket.join(name);
    sendStatus(room);
  });

  socket.on('guess', (data) => {
    const { uri, room, nickname } = data;
    let { totalPoints, guesses } = room;
    const { selectedSong, scoreUpdates, roundStartTime, roundTime, playerList } = room;
    if (selectedSong.uri === uri) {
      const current = new Date();
      const diff = current.getTime() - roundStartTime.getTime();
      const roundScore = Math.round((roundTime - diff) / 1000);
      scoreUpdates[nickname] = roundScore;
      totalPoints += roundScore;
      console.log('correct');
    }
    guesses += 1;
    sendStatus(room);
    if (guesses >= playerList.count() - 1) {
      stopRound();
    }
  });

  socket.on('selectedSong', (data) => {
    const { song, room } = data;
    let { selectedSong } = room;
    if (songArray.length === 1 && songArray[0] === '5QjJgPU8AJeickx34f7on6') {
      songArray = [];
    }
    if (songArray.length > 3) {
      songArray.splice(0, 1);
    }
    console.log('got selectedSong');
    selectedSong = song;
    startRound(room);
    playSong(song.uri);
    sendStatus(room);
    analyzeSong(song.id);
  });

  socket.on('hostStartGame', (room) => {
    console.log('got hostStartGame');
    startChoose(room);
  });

  socket.on('hostReset', (room) => {
    console.log('got hostReset');
    resetRoom(room);
  });

  socket.on('reconnected', ({ nick, room, score }) => {
    const nickname = nick;
    const { allowReconnect } = room;
    if (allowReconnect) {
      console.log(`reconnected ${nick} with ${score}`);
      addPlayer(nick, score);
    } else {
      console.log(`Didnt allow reconnect from ${nick}`);
    }
  });

  /* socket.on('disconnect', ({ nickname, room }) => {
    // let { allowReconnect } = room;
    const { leader, playerList, scores, scoreUpdates } = room;
    const allowReconnect = true;
    if (leader === nickname) {
      pickLeader(room);
    }

    if (playerList.find(nickname)) {
      playerList.remove(nickname);
    }

    if (playerList.count() < 2) {
      resetRoom(room);
    }

    delete scores[nickname];
    delete scoreUpdates[nickname];
    sendStatus();
    console.log(`${nickname} disconnected`);
  }); */
});
