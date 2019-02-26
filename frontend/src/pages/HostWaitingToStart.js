import React, { Component } from 'react';
import Players from '../components/Players';

const HostWaitingToStart = (props) => {
  const { room, onStartGame } = props;
  return (
    <div>
      <h2>Waiting for players</h2>
      {room && room.name && <h2>{`Room code: ${room.name}`}</h2>}
      {room && room.players && room.players.length > 1 && (
        <button type="button" className="button" onClick={() => onStartGame()}>
          Start game
        </button>
      )}
      {room && room.players && <Players players={room.players} />}
    </div>
  );
};

export default HostWaitingToStart;
