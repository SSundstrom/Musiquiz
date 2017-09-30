var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId : 'c11d380eadd04921a083d5637c108f8c',
    clientSecret : 'f8db5475fa7748e28203dd0ebac181e4',
    redirectUri : ''
});

const express = require('express')
const app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);


spotifyApi.clientCredentialsGrant()
.then(function(data) {
  console.log('The access token expires in ' + data.body['expires_in']);
  console.log('The access token is ' + data.body['access_token']);

  // Save the access token so that it's used in future calls
  spotifyApi.setAccessToken(data.body['access_token']);
}, function(err) {
      console.log('Something went wrong when retrieving an access token', err);
});


app.get('/', function (req, res) {
    res.send('Hello World!')  
})

app.get('/search/:name', function(req, res) {
    spotifyApi.searchTracks(req.params.name)
        .then(function(data) {
            res.send(data)
        }, function(err) {
        console.error(err);
        });
})


app.get('/io', function(req, res){
  res.send('<h1> HEJSAN </h1>');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


http.listen(3000, function(){
  console.log('listening on *:3000');
});

