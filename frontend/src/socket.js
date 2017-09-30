import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:8888');

console.log(socket);

function onJoin(callback) {
  
}

export { onJoin };