var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId : 'c11d380eadd04921a083d5637c108f8c',
    clientSecret : 'f8db5475fa7748e28203dd0ebac181e4',
    redirectUri : ''
});

const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


function getToken() {
  spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
        console.log('Something went wrong when retrieving an access token', err);
  });
}

getToken()

// Refresh token before 1h.
setInterval(getToken, 3598000)

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/search/:name', function(req, res) {
    spotifyApi.searchTracks(req.params.name)
        .then(function(data) {
            res.emit(data)
        }, function(err) {
        console.error(err);
        });
})

app.get('/', function(req, res){
  res.sendFile(__dirname + '/file.html');
});

http.listen(8888, function () {
  console.log('Example app listening on port 8888!')
})

// --------------------------- Functions ---------------------------------

var players = []
var hostSocket
var leader
var guesses
var score = {}
var selectedSong
var gamestate = 'pregame'

function addNewPlayer(nick) {
  players.push(nick)
  sendStatus()
};

function setHost(socket) {
  hostSocket = socket
};

function pickLeader() {
  if (!leader){
    leader = players[0]
  } else {
    leader = players[players.indexOf(leader)+1]
  }
  leader()
};

function sendStatus() {
  io.emit('status', {score:score, players:players, gamestate:gamestate})
  console.log('sendStatus')
}

function hostPlaySong(uri) {
  io.emit('hostPlaySong', uri)
  console.log('hostPlaySong')
}

function correctSong() {
  io.emit('correctSong', correctSong)
  console.log('correctSong')
}

function leader() {
  io.emit('leader', leader)
  console.log('leader')
}

function startRound() {
  console.log('startRound')
  if (gamestate == 'choose') {
    gamestate = 'midgame'
    io.emit('startRound')
    setTimeout(stopRound, 30000)
  }
}

function stopRound() {
  console.log('stopRound')
  if (gamestate == 'midgame') {
    guesses = 0
    gamestate = 'finished'
    io.emit('stopRound')
    startChoose()
  }
}

function startChoose() {
  console.log('startChoose')
  if (gamestate == 'lobby' && gamestate == 'finished') {
    gamestate = 'choose'
    pickLeader()
    sendStatus()
  }
}
  
// -------------- IO - Events --------------

io.on('connection', function(socket){
  console.log('a user connected');
  sendStatus()
  var nickname;

  socket.on('join', function(name) {
    console.log('got join')
    nickname = name;
    addNewPlayer(nickname)
  });

  socket.on('hostJoin', function() {
    console.log('hostJoin')
    if (gamestate == 'pregame') {
      gamestate = 'lobby'
      hostSocket = socket
      sendStatus()
    }
  })

  socket.on('guess', function(uri) {
    console.log('got guess')
    if (selectedSong.uri = uri) {
      score[nickname] += 7
    }
    guesses++
    if (guesses >= players.length) {
      stopRound()
    }
  })

  socket.on('selectedSong', function(songObject) {
    console.log('got selectedSong')
    selectedSong = songObject
    startRound()
    sendStatus(score, players, gamestate)
  })

  socket.on('hostStartGame', function() {
    console.log('got hostStartGame')
    startChoose()
  })

  socket.on('hostReset', function() {
    console.log('got hostReset')
    stopRound()
    players = []
    hostSocket = null
    leader = null
    selectedSong = null
    score = []
    sendStatus()
    
  })

  socket.on('disconnect', function(){
    players.splice(players.indexOf(nickname),1)
    sendStatus()
    console.log('user disconnected');
  });

});
