const SpotifyWebApi = require('spotify-web-api-node');

const searchApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: '',
});

function getToken() {
  searchApi.clientCredentialsGrant().then(
    data => {
      setTimeout(getToken, data.body.expires_in * 1000);
      searchApi.setAccessToken(data.body.access_token);
      // console.log(`The search access token expires in ${data.body.expires_in}`);
      // console.log(`The search access token is ${data.body.access_token}`);
    },
    err => {
      console.log('Something went wrong when retrieving an access token', err);
    },
  );
}

getToken();

module.exports = searchApi;
