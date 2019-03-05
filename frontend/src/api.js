/* global window fetch */
import io from 'socket.io-client';

const api = window.location.origin.replace(/3000/, '8888');

const socket = io(api);

function disconnect() {
  socket.disconnect();
}

function reconnect() {
  socket.connect();
}

window.disconnect = disconnect;

window.reconnect = reconnect;

function on(event, callback) {
  socket.on(event, data => {
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
  console.log('search');
  fetch(`${api}/search/${song}`)
    .then(response => {
      console.log('fetch');
      return response.json();
    })
    .then(res => callback(res.body.tracks.items))
    .catch(e => {
      console.log(e);
    });
}

function getAudioAnalysis(name, callback) {
  console.log('getAudioAnalysis');
  fetch(`${api}/recommendations/${name}`)
    .then(response => {
      console.log('fetch audio analysis');
      return response.json();
    })
    .then(res => callback(res.body.tracks))
    .catch(e => {
      console.log(e);
    });
}

export { on, emit, search, getAudioAnalysis };
