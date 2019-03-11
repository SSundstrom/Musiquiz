/* global window */

import React, { useContext } from 'react';
import Scores from '../components/Scores';
import Track from '../components/Track';
import { GameContext } from '../game-context';
import Settings from '../components/Settings';
import HostScreenStyles from '../components/styles/HostScreenStyles';
import QR from '../components/QR';

const HostScreen = () => {
  const context = useContext(GameContext);

  const { state } = context;
  const { correctSong, players, name, gamestate, leader, guessTimer } = state;
  const { onKickPlayer } = context;
  return (
    <HostScreenStyles>
      <QR className="qr" size={256} value={`${window.location.href.replace('#', '')}${state.name}`} />
      <div className="game">
        <h1>{name}</h1>
        {gamestate === 'choose' && <h2>{`Waiting for ${leader.nickname} to choose a song`}</h2>}
        {guessTimer > 0 && <h1>{guessTimer}</h1>}
        {correctSong && (
          <div>
            <span>The correct song was...</span>
            <Track track={correctSong} />
          </div>
        )}
        <div>
          <Scores isHost players={players} onKickPlayer={onKickPlayer} />
        </div>
      </div>
      <div className="settings">
        <Settings />
      </div>
    </HostScreenStyles>
  );
};

export default HostScreen;
