var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: '3736cb70c4024decbf118aae05fda241',
  clientSecret: '2e9fedd4c3894dd3b3a2421d06b1e8bb',
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


averageDanceability = 0.5
averageEnergy = 0.5
energyArray = []
deleteTemp = true

app.get('/recommendations', function(req, res) {
  var collectedDanceability = 0
  var collectedEnergy = 0;

    for (var i=0; i<energyArray.length; i++){
    collectedEnergy = collectedEnergy + energyArray[i]
    averageEnergy = collectedEnergy/energyArray.length
  }
    for (var i=0; i<danceabilityArray.length; i++){
      collectedDanceability = collectedDanceability + danceabilityArray[i]
      averageDanceability = collectedDanceability/danceabilityArray.length
    }
      if (songArray.length ==  0){
        songArray.push('5QjJgPU8AJeickx34f7on6')
      }
      if (averageDanceability > 0.8){
        averageDanceability = 0.8
      }
      if (averageEnergy > 0.8){
        averageEnergy = 0.8
      }
      console.log(songArray)
      spotifyApi.getRecommendations({/*min_danceability: averageDanceability-0.2, max_danceability: averageDanceability+0.2, min_energy: averageEnergy-0.2, max_energy: averageEnergy+0.2,*/ seed_tracks: [songArray] })
      .then(function(rec) {
        res.send(rec)
      }).catch(function(e) {
        console.log(e);
      });
});


app.use('/', express.static('frontend/build'))

http.listen(8888, function () {
  console.log('Example app listening on port 8888!')
})

// --------------------------- Functions ---------------------------------
var disconnected = {}
var players = []
var hostSocket
var leader
var guesses = 0
var score = {}
var selectedSong
var gamestate = 'pregame'
var totalPoints = 0

function addNewPlayer(nick) {
  players.push(nick)
  console.log(nick)
  score[nick] = 0
  if (leader) {
    sendLeader()
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
  hostSocket.emit('hostPlaySong', uri)
  io.emit('playing', selectedSong)
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
var timeout;
var timer = 30000

function startRound() {
  console.log('startRound')

  if (gamestate == 'choose') {
    gamestate = 'midgame'
    io.emit('startRound', timer)
    timeout = setTimeout(stopRound, timer)
    roundStartTime = new Date();
  }
}

function stopRound() {
  console.log('stopRound')
  if (gamestate == 'midgame') {
    clearTimeout(timeout)
    score[leader] += Math.round(totalPoints/(players.length-1))
    totalPoints = 0
    guesses = 0
    gamestate = 'finished'
    io.emit('stopRound', selectedSong);
    startChoose()
  }
}

function hostReset() {
  players = []
  disconnected = {}
  hostSocket = false
  leader = false
  selectedSong = false
  score = {}
  guesses = 0
  gamestate = 'pregame'
  sendStatus()
}

var danceabilityArray = [];
var songArray = []

function analyzeSong(id) {
  spotifyApi.getAudioFeaturesForTrack(id)
  .then(function(data) {
      danceabilityArray.push(data.body.danceability);
      energyArray.push(data.body.energy)
      songArray.push(id)
  }, function(err) {
  console.error(err);
  });
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
    console.log('got join from')
    nickname = name;
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
      hostSocket.on('timer', (time) => {
        console.log('got new timer' + time)
        timer = time*1000
      })
      sendStatus()
    }
  })

  socket.on('guess', function(uri) {
    console.log('got guess')
    if (selectedSong.uri == uri) {
      var current = new Date();
      var diff = current.getTime() - roundStartTime.getTime();
      var roundScore = Math.round((30000 - diff)/1000)
      score[nickname] += roundScore
      totalPoints = totalPoints + roundScore
      console.log(score[nickname]);
      
    }
    guesses++
    sendStatus()
    if (guesses >= players.length-1) {
      stopRound()
    }
  })

  socket.on('selectedSong', function(songObject) {
    if (songArray.length ==  1 && songArray[0] == '5QjJgPU8AJeickx34f7on6'){
      songArray = [];
    }
    if (songArray.length > 3){
      songArray.splice(0,1)
    }
    console.log('got selectedSong')
    selectedSong = songObject
    startRound()
    playSong(songObject.uri)
    sendStatus(score, players, gamestate)
    analyzeSong(songObject.id);
  })

  socket.on('hostStartGame', function() {
    console.log('got hostStartGame')
    startChoose()
  })

  socket.on('hostReset', function() {
    console.log('got hostReset')
    hostReset()
  })

  socket.on('reconnected', (nick) => {
    console.log('reconnected ' + nick)
    if (nick in disconnected) {
      addNewPlayer(nick)
      score[nick] = disconnected[nick]
      delete disconnected[nick]
    } else {
      console.log(nick + ' should reload site')
    }
  })

  socket.on('disconnect', function(){
    if (leader == nickname) {
      pickLeader()
    }
    var index = players.indexOf(nickname)
    if (index != -1) {
      disconnected[nickname] = score[nickname]
      players.splice(index,1)
    }
    if (players.length < 2) {
      hostReset()
    }
    delete score[nickname]
    sendStatus()
    console.log('user disconnected');
    console.log(disconnected)
  });


});
