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
            res.send(data)
        }, function(err) {
        console.error(err);
        });
})

http.listen(8888, function () {
  console.log('Example app listening on port 8888!')
})

// --------------------------- Functions ---------------------------------

var players = []
var hostSocket
var leader
var guesses = 0
var score = {}
var selectedSong
var gamestate = 'pregame'

function addNewPlayer(nick) {
  if (players.indexOf(nick) != -1){
    addNewPlayer(nick+" :-)")
  } else {
    players.push(nick)
  }
  sendStatus()
};

function setHost(socket) {
  hostSocket = socket
};

function sendStatus() {
  io.emit('status', {score:score, players:players, gamestate:gamestate, guesses:guesses})
  console.log('sendStatus')
}

function playSong(uri) {
  // io.emit('playSong', uri)
  
  console.log('playSong')
}

function sendLeader() {
  io.emit('leader', leader)
  console.log('leader')
}

function pickLeader() {
  if (!leader){
    leader = players[0]
  } else {
    var nextIndex = players.indexOf(leader)+1
    if (nextIndex < players.length) {
      leader = players[nextIndex]
    } else {
      leader = players[0]
    }
    
  }

  sendLeader()
};

var roundStartTime;

function startRound() {
  console.log('startRound')

  const timer = 30000
  if (gamestate == 'choose') {
    gamestate = 'midgame'
    io.emit('startRound', timer)
    setTimeout(stopRound, timer)
    roundStartTime = new Date();
  }
}

function stopRound() {
  console.log('stopRound')
  if (gamestate == 'midgame') {
    guesses = 0
    gamestate = 'finished'
    io.emit('stopRound', selectedSong);
    startChoose()
  }
}

function hostReset() {
  players = []
  hostSocket = false
  leader = false
  selectedSong = false
  score = []
  guesses = 0
  gamestate = 'pregame'
  sendStatus()
}

function startChoose() {
  console.log('startChoose')
  if (gamestate == 'lobby' || gamestate == 'finished') {
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
    score[nickname] = 0
    addNewPlayer(nickname)
  });

  socket.on('hostJoin', function() {
    console.log('hostJoin')
    if (gamestate == 'pregame') {
      gamestate = 'lobby'
      hostSocket = socket
      hostSocket.on('disconnect', function() {
        console.log('got host disconnect')
        hostReset()
      })
      sendStatus()
    }
  })

  socket.on('guess', function(uri) {
    console.log('got guess')
    if (selectedSong.uri == uri) {
      var current = new Date();
      var diff = current.getTime() - roundStartTime.getTime();
      score[nickname] += Math.round((30000 - diff)/1000)
      console.log(score[nickname]);
      
    }
    guesses++
    sendStatus()
    if (guesses >= players.length-1) {
      stopRound()
    }
  })

  socket.on('selectedSong', function(songObject) {
    console.log('got selectedSong')
    selectedSong = songObject
    startRound()
    playSong(songObject.uri)
    sendStatus(score, players, gamestate)
  })

  socket.on('hostStartGame', function() {
    console.log('got hostStartGame')
    startChoose()
  })

  socket.on('hostReset', function() {
    console.log('got hostReset')
    hostReset()
  })

  socket.on('disconnect', function(){
    if (leader == nickname) {
      pickLeader()
    }
    players.splice(players.indexOf(nickname),1)
    if (players.length < 2) {
      hostReset()
    }
    delete score[nickname]
    sendStatus()
    console.log('user disconnected');
  });

});
