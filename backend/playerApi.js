/* global window */
const SpotifyWebApi = require('spotify-web-api-node');

const credentials = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.CALLBACK_URL,
};

const spotifyApi = new SpotifyWebApi(credentials);

async function completeAuth(code) {
  try {
    console.log(code);
    console.log(`${code}`);
    console.log(spotifyApi);
    const data = await spotifyApi.authorizationCodeGrant(code);

    console.log(`The token expires in ${data.body.expires_in}`);
    console.log(`The access token is ${data.body.access_token}`);
    console.log(`The refresh token is ${data.body.refresh_token}`);

    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(data.body.access_token);
    spotifyApi.setRefreshToken(data.body.refresh_token);

    setInterval(() => {
      spotifyApi.refreshAccessToken().then(
        refreshData => {
          console.log('The access token has been refreshed!');

          // Save the access token so that it's used in future calls
          spotifyApi.setAccessToken(refreshData.body.access_token);
        },
        err => {
          console.log('Could not refresh access token', err);
        },
      );
    }, data.body.expires_in * 900);
  } catch (err) {
    console.log(err);
  }
}

module.exports = { completeAuth };
