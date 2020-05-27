/* global window */
import axios from 'axios';
import io from 'socket.io-client';

const api = window.location.origin.replace(process.env.REACT_APP_PORT, process.env.REACT_APP_BACKEND_PORT);
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
  socket.on(event, (data) => {
    console.log('receiving', event, data);
    callback(data);
  });
}

function emit(event, data) {
  console.log('sending', event, data);
  socket.emit(event, data);
}

const search = async (song) => {
  console.log('search');
  song = encodeURIComponent(song);
  try {
    const url = `${api}/search/${song}`;
    const result = await axios.get(url);
    return result.data.body.tracks.items;
  } catch (err) {
    throw err;
  }
};

const getAudioAnalysis = async (name) => {
  console.log('getAudioAnalysis');
  try {
    const url = `${api}/recommendations/${name}`;
    const result = axios.get(url);
    return result.data;
  } catch (err) {
    throw err;
  }
};

export { on, emit, search, getAudioAnalysis };
