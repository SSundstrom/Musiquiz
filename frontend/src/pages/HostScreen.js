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
      <QR name={name} className="qr" size={256} value={`${window.location.href.replace('#', '')}${state.name}`} />
      <div className="game">
        {gamestate === 'choose' && <h1>{`Waiting for ${leader.nickname}`}</h1>}
        {guessTimer > 0 && <h1>{`Time left: ${guessTimer}`}</h1>}
        <div className="content">
          {correctSong && (
            <div>
              <span>The correct song was...</span>
              <Track track={correctSong} />
            </div>
          )}
          <Scores isHost players={players} onKickPlayer={onKickPlayer} />
        </div>
      </div>
      <Settings />
    </HostScreenStyles>
  );
};

export default HostScreen;
