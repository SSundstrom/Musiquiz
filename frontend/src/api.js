import openSocket from 'socket.io-client';

const api = 'http://localhost:8888';

const socket = openSocket(api);

function on(event, callback) {
  socket.on(event, callback);
}

function emit(event, data, callback) {
  socket.emit(event, data);
}

function search(song, callback) {
  song = encodeURIComponent(song);

  fetch(api + '/search/' + song).then(function(response) {
    return response.json();
  }).then(callback);
}

export { on, emit, search };