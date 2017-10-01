var SpotifyPlayer = {
  base_config: {
    api_endpoint: 'https://api.spotify.com',
    auth_endpoint: 'https://accounts.spotify.com/authorize'
  },
  config: {
    player_name: 'Dude, what\'s my song',
    client_id: 'c11d380eadd04921a083d5637c108f8c',
    redirect_uri: window.location.origin,
    scopes: ['streaming', 'user-read-birthdate', 'user-read-email', 'user-read-private']
  },
  access_token: null,
  player: null,
  device_id: null,
  sendToLogin: function () {
    window.location = [
      this.base_config.auth_endpoint,
      "?client_id=" + this.config.client_id,
      "&redirect_uri=" + this.config.redirect_uri,
      "&scope=" + this.config.scopes.join('%20'),
      "&response_type=token",
      "&show_dialog=true"
    ].join('');
  }
};

// V2: Added playback controls
SpotifyPlayer.controls = {
  _request: function (method, endpoint, params) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, SpotifyPlayer.base_config.api_endpoint + endpoint, true);
      xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
      xhr.setRequestHeader('Authorization','Bearer ' + SpotifyPlayer.access_token);
      xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (err) {
            reject();
          }
        }
      };
      xhr.send(JSON.stringify(params));
    });
  },
  switchPlayback: function () {
    this._request("PUT", "/v1/me/player", { device_ids: [SpotifyPlayer.device_id] });
  },
  play: function (uris) {
    if (uris) {
      this._request("PUT", "/v1/me/player/play", { uris: uris });
    } else {
      this._request("PUT", "/v1/me/player/play");
    }
  },
  pause: function () {
    this._request("PUT", "/v1/me/player/pause");
  },
  prevTrack: function () {
    this._request("POST", "/v1/me/player/previous");
  },
  nextTrack: function () {
    this._request("POST", "/v1/me/player/next");
  },
  searchAndPlay: function (query) {
    this._request("GET", "/v1/search?type=track&q=" + query + "*&market=from_token", {}).then(function (results) {
      SpotifyPlayer.controls.play([results.tracks.items[0].uri]);
    });
  }
};

let hash = window.location.hash
  .substring(1)
  .split('&')
  .reduce(function (initial, item) {
    if (item) {
      var parts = item.split('=');
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});

// Make our window URL hash empty.
SpotifyPlayer.access_token = hash.access_token;
window.location.hash = '';

export function auth() {
  // If there is no token, redirect to Spotify authorization
  if (!SpotifyPlayer.access_token) {
    SpotifyPlayer.sendToLogin();
  }
}

window.onSpotifyPlayerAPIReady = function() {
  // Initialize our Player
  SpotifyPlayer.player = new window.Spotify.Player({
    name: SpotifyPlayer.config.player_name,
    getOauthToken: function (cb) { cb(SpotifyPlayer.access_token); },
    volume: 0.8
  });

  // Player is ready and can be issued commands
  SpotifyPlayer.player.on('ready', function (e) {
    console.log('Ready to rock!', e);
    SpotifyPlayer.device_id = e.device_id;
  });

  // Player state changed
  // The event contains information about the current player state
  SpotifyPlayer.player.on('player_state_changed', function (e) {
    console.log('Player state changed', window.e = e);
  });

  // Handle errors
  SpotifyPlayer.player.on('initialization_failed', function (e) {
    console.log('Initialization Failed', e);
  });
  SpotifyPlayer.player.on('authentication_error', function (e) {
    console.log('Authentication Error', e);
  });
  SpotifyPlayer.player.on('account_error', function (e) {
    console.log('Account Error', e);
  });
  SpotifyPlayer.player.on('playback_error', function (e) {
    console.log('Playback Error', e);
  });

  // Connect to the Player
  SpotifyPlayer.player.connect();
}

export default SpotifyPlayer;