/* global window */
const SpotifyWebApi = require('spotify-web-api-node');

module.exports = {
  getAuthUri: function getAuthUri(redirectUri, room) {
    const credentials = {
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      redirectUri,
    };

    const scope = ['user-modify-playback-state'];

    const spotifyApi = new SpotifyWebApi(credentials);
    return spotifyApi.createAuthorizeURL(scope, room);
  },
  completeAuth:
    // Retrieve an access token and a refresh token
    function completeAuth(code) {
      this.spotifyApi.authorizationCodeGrant(code).then(
        data => {
          console.log(`The token expires in ${data.body.expires_in}`);
          console.log(`The access token is ${data.body.access_token}`);
          console.log(`The refresh token is ${data.body.refresh_token}`);

          // Set the access token on the API object to use it in later calls
          this.spotifyApi.setAccessToken(data.body.access_token);
          this.spotifyApi.setRefreshToken(data.body.refresh_token);

          setInterval(() => {
            this.spotifyApi.refreshAccessToken().then(
              refreshData => {
                console.log('The access token has been refreshed!');

                // Save the access token so that it's used in future calls
                this.spotifyApi.setAccessToken(refreshData.body.access_token);
              },
              err => {
                console.log('Could not refresh access token', err);
              },
            );
          }, data.body.expires_in * 1000);

          return this.spotifyApi;
        },
        err => {
          console.log('Something went wrong!', err);
        },
      );
    },
};
