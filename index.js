var SpotifyWebApi = require('spotify-web-api-node');
var ds = require('datastructures-js');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: 'c11d380eadd04921a083d5637c108f8c',
    clientSecret: 'f8db5475fa7748e28203dd0ebac181e4',
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

getToken();

// Refresh token before 1h.
setInterval(getToken, 3598000);

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/search/:name', function(req, res) {
    spotifyApi.searchTracks(req.params.name, {market:'SE'} )
        .then(function(data) {
            res.send(data);
        }, function(err) {
        console.error(err);
        });
});

var averageDanceability = 0.5;
var averageEnergy = 0.5;
var energyArray = [];
// var deleteTemp = true;

app.get('/recommendations', function(req, res) {
    var collectedDanceability = 0;
    var collectedEnergy = 0;

    for (var i=0; i<energyArray.length; i++){
        collectedEnergy = collectedEnergy + energyArray[i];
        averageEnergy = collectedEnergy/energyArray.length;
    }
    for (i=0; i<danceabilityArray.length; i++){
        collectedDanceability = collectedDanceability + danceabilityArray[i];
        averageDanceability = collectedDanceability/danceabilityArray.length;
    }
    if (songArray.length ==  0){
        songArray.push('5QjJgPU8AJeickx34f7on6');
    }
    if (averageDanceability > 0.8){
        averageDanceability = 0.8;
    }
    if (averageEnergy > 0.8){
        averageEnergy = 0.8;
    }
    console.log(songArray);
    spotifyApi.getRecommendations({/*min_danceability: averageDanceability-0.2, max_danceability: averageDanceability+0.2, min_energy: averageEnergy-0.2, max_energy: averageEnergy+0.2,*/ seed_tracks: [songArray] })
        .then(function(rec) {
            res.send(rec);
        }).catch(function(e) {
            console.log(e);
        });
});

app.use('/', express.static('frontend/build'));

http.listen(8888, function () {
    console.log('Example app listening on port 8888!');
});

// --------------------------- Functions ---------------------------------

var playerList = ds.linkedList();
var hostSocket;
var leader;
var guesses = 0;
var scores = {};
var scoreUpdates = {};
var selectedSong;
var gamestate = 'pregame';
var totalPoints = 0;
var allowReconnect = false;

function hostReset() {
    playerList = ds.linkedList();
    hostSocket;
    leader;
    guesses = 0;
    scores = {};
    scoreUpdates = {};
    selectedSong;
    gamestate = 'pregame';
    totalPoints = 0;
    allowReconnect = false;
    sendStatus();
}

function addPlayer(nick, score) {
    playerList.addLast(nick);
    console.log(nick);
    scores[nick] = score;
    if (leader) {
        sendLeader();
    }
    sendStatus();
}

function sendStatus() {

    function toArray(queue) {
        var retArray = [];
        if (queue) {
            var tmp = queue.findFirst();
            while (tmp) {
                retArray.push(tmp.getValue());
                tmp = tmp.getNext();
            }
        }
        return retArray;
    }

    io.emit('status', {scores:scores, players:toArray(playerList), gamestate:gamestate, guesses:guesses, scoreUpdates:scoreUpdates});
    console.log('sendStatus');
}

function playSong(uri) {
    hostSocket.emit('hostPlaySong', uri);
    io.emit('playing', selectedSong);
    console.log('playSong');
}

function sendLeader() {
    io.emit('leader', leader);
    console.log('leader');
}

function clearLeader() {
    io.emit('leader', undefined);
    console.log('leader');
}

function pickLeader() {
    var node = playerList.findFirst();
    if (node) {
        leader = node.getValue();
        playerList.removeFirst();
        playerList.addLast(leader);    
    }
    sendLeader();
}

var roundStartTime;
var timeout;
var roundTime = 30000;
var displayCorrectTime = 10000;

function startRound() {
    console.log('startRound');
    if (gamestate == 'choose') {
        gamestate = 'midgame';
        io.emit('startRound', roundTime);
        timeout = setTimeout(stopRound, roundTime);
        roundStartTime = new Date();
    }
}

function stopRound() {
    console.log('stopRound');
    if (gamestate == 'midgame') {
        clearTimeout(timeout);
        var leaderScore = Math.round(totalPoints/(playerList.count()-1));
        if (leaderScore > 0) {
            scoreUpdates[leader] = leaderScore;
        }
        totalPoints = 0;
        guesses = 0;
        clearLeader();
        gamestate = 'finished';
        sendStatus();
        io.emit('stopRound', {'selectedSong':selectedSong});
        setTimeout(applyUpdates, displayCorrectTime/2);
        setTimeout(startChoose, displayCorrectTime);
    }
}

var danceabilityArray = [];
var songArray = [];

function analyzeSong(id) {
    spotifyApi.getAudioFeaturesForTrack(id)
        .then(function(data) {
            danceabilityArray.push(data.body.danceability);
            energyArray.push(data.body.energy);
            songArray.push(id);
        }, function(err) {
            console.error(err);
        });
}


function startChoose() {
    console.log('startChoose');
    if (gamestate == 'lobby' || gamestate == 'finished') {
        gamestate = 'choose';
        pickLeader();
        sendLeader();
        sendStatus();
    }
}

function applyUpdates() {
    for (var nick in scoreUpdates) {
        scores[nick] += scoreUpdates[nick];
    }
    scoreUpdates = {};
    sendStatus();
}
  
// -------------- IO - Events --------------

io.on('connection', (socket) => {
    console.log('a user connected');
    sendStatus();
    var nickname;

    socket.on('join', function(name) {
        console.log('got join from');
        nickname = name;
        addPlayer(nickname, 0);
    });

    socket.on('hostJoin', function() {
        console.log('hostJoin');
        if (gamestate == 'pregame') {
            gamestate = 'lobby';
            hostSocket = socket;
            hostSocket.on('disconnect', function() {
                console.log('got host disconnect');
                hostReset();
            });

            hostSocket.on('timer', (time) => {
                console.log('got new timer' + time);
                roundTime = time*1000;
            });
            sendStatus();
        }
    });

    socket.on('guess', function(uri) {
        console.log('got guess from ' + nickname);
        if (selectedSong.uri == uri) {
            var current = new Date();
            var diff = current.getTime() - roundStartTime.getTime();
            var roundScore = Math.round((roundTime - diff)/1000);

            scoreUpdates[nickname] = roundScore;
            totalPoints = totalPoints + roundScore;

            console.log('correct');
        }
        guesses++;
        sendStatus();
        if (guesses >= playerList.count()-1) {
            stopRound();
        }
    });

    socket.on('selectedSong', function(songObject) {
        if (songArray.length ==  1 && songArray[0] == '5QjJgPU8AJeickx34f7on6'){
            songArray = [];
        }
        if (songArray.length > 3){
            songArray.splice(0,1);
        }
        console.log('got selectedSong');
        selectedSong = songObject;
        startRound();
        playSong(songObject.uri);
        sendStatus();
        analyzeSong(songObject.id);
    });

    socket.on('hostStartGame', function() {
        console.log('got hostStartGame');
        startChoose();
    });

    socket.on('hostReset', function() {
        console.log('got hostReset');
        hostReset();
    });

    socket.on('reconnected', (data) => {
        nickname = data.nick;
        var score = 0;
        if (allowReconnect) {
            if (data.score) {
                score = data.score;
            }
            console.log('reconnected ' + data.nick + ' with ' + data.score);
            addPlayer(data.nick, score);
        } else {
            console.log('Didnt allow reconnect from ' + data.nick );
        }
    });

    socket.on('disconnect', function(){

        allowReconnect = true;

        if (leader == nickname) {
            pickLeader();
        }

        if (playerList.find(nickname)) {
            playerList.remove(nickname);
        }
        
        if (playerList.count() < 2) {
            hostReset();
        }

        delete scores[nickname];
        delete scoreUpdates[nickname];
        sendStatus();
        console.log(nickname + ' disconnected');
    });
});
