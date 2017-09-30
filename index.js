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

app.get('/search/:name', function(req, res) {
    spotifyApi.searchTracks(req.params.name)
        .then(function(data) {
            res.send(data)
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
var scores = {}

function addNewPlayer(nick) {
  if (host) {
    players.push(nick)
  }
};

function setHost(socket) {
  hostSocket = socket
};

function play(players){

};

function pickLeader() {
  if (!leader){
    leader = players[0]
  } else {
    leader = players[players.indexOf(leader)+1]
  }
};


function leaderChooseSong() {
  io.send({players:players, leader:leader})
}

function chooseSong() {
  io.send({players:players, leader:leader})
}

function sendStatus() {
  io.send('status', {score:score, players:players, gamestate:gamestate})
}

function hostPlaySong(uri) {
  io.send('hostPlaySong', uri)
}

function correctSong() {
  io.send('correctSong', correctSong)
}

function leader() {
  io.send('leader', leader)
}

function startRound() {
  if (gamestate == 'choose') {
    gamestate = 'midgame'
    io.send('startRound')
    setTimeout(stopRound, 30000)
  }
}

function stopRound() {
  if (gamestate == 'midgame') {
    gamestate = 'finished'
    io.send('stopRound')
  }
}

// -------------- IO - Events --------------

io.on('connection', function(socket){
  console.log('a user connected');

  var nickname;

  socket.on('join', function(name) {
    nickname = name;
  });

  socket.on('hostjoin', function() {
    hostSocket = socket
    gamestate = 'lobby'
  })

  socket.on('guess', function(uri) {
    if (selectedSong.uri = uri) {
      scores[nickname] += 7
    }
    guesses++
    if (guesses >= players.length) {
      stopRound()
    }
  })

  socket.on('selectedSong', function(uri) {
    console.log('dummy')
  })

  socket.on('hostStartGame', function() {
    gamestate = 'choose'
    sendStatus()
  })

  socket.on('hostReset', function() {
    console.log('dummy')
  })

  socket.on('disconnect', function(){
    
    console.log('user disconnected');
  });

});
