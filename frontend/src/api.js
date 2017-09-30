import openSocket from 'socket.io-client';

const api = 'http://localhost:8888';

const socket = openSocket(api);

socket.on('connect', function() {
  console.log('connected');
});

function on(event, callback) {
  socket.on(event, (data) => {
    console.log('receiving', event, data);
    callback(data);
  });
}

function emit(event, data, callback) {
  console.log('sending', event, data);
  socket.emit(event, data);
}

function search(song, callback) {
  song = encodeURIComponent(song);
  console.log('search')
  fetch(api + '/search/' + song).then(function(response) {
    console.log('fetch')
    return response.json();
  }).then((res) => callback(res.body.tracks.items))
  .catch((e) => {
    console.log(e)
  });
}

export { on, emit, search };