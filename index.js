var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : 'c11d380eadd04921a083d5637c108f8c',
  clientSecret : 'f8db5475fa7748e28203dd0ebac181e4',
  redirectUri : ''
});

const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})