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
  const { correctSong, players, name } = state;
  const { onKickPlayer } = context;
  return (
    <HostScreenStyles>
      <QR className="qr" size={256} value={`${window.location.href.replace('#', '')}${state.name}`} />
      <div className="game">
        <h1>{`Room code: ${name}`}</h1>
        {state.guessTimer > 0 && <h1>{state.guessTimer}</h1>}
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
