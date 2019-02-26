import React, { Component } from 'react';
import Players from '../components/Players';

const PlayerWaitingToStart = ({ room, nickname }) => (
  <div>
    <h2>Waiting for host to start</h2>
    {room && room.name && <h2>{`Room code: ${room.name}`}</h2>}
    {room && room.players && <Players players={room.players} nickname={nickname} />}
  </div>
);

export default PlayerWaitingToStart;
