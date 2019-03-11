/* global window */

import React, { useContext } from 'react';
import Scores from '../components/Scores';
import Track from '../components/Track';
import { GameContext } from '../game-context';
import Settings from '../components/Settings';
import HostScreenStyles from '../components/styles/HostScreenStyles';
import QR from '../components/QR';
import QueueStyles from '../components/styles/QueueStyles';

const HostScreen = () => {
  const context = useContext(GameContext);

  const { state } = context;
  const { correctSong, players, name, gamestate, leader, guessTimer } = state;
  const { onKickPlayer } = context;
  return (
    <HostScreenStyles>
      <div className="qr">
        <QR name={name} className="qr" size={256} value={`${window.location.href.replace('#', '')}${state.name}`} />
        {players && (
          <QueueStyles>
            {players.length > 0 && (
              <div className="queue-heading">
                <div className="queue-label">Choosing now:</div>
                <div className="queue-name">{players[0].nickname}</div>
              </div>
            )}
            {players.length > 1 && (
              <div className="queue-heading">
                <div className="queue-label">Next:</div>
                <div className="queue-label">{players[1].nickname}</div>
              </div>
            )}
            {players.length > 2 && (
              <React.Fragment>
                <hr />
                {players
                  .sort((first, second) => first.leader / first.rounds - second.leader / second.rounds)
                  .filter((p, index) => index > 1)
                  .map(player => (
                    <div>{player.nickname}</div>
                  ))}
              </React.Fragment>
            )}
          </QueueStyles>
        )}
      </div>
      <div className="game">
        {gamestate === 'choose' && <h1>{`Waiting for ${leader.nickname}`}</h1>}
        {guessTimer > 0 && <h1>{`Time left: ${guessTimer}`}</h1>}
        <div className="content">
          {gamestate !== 'midgame' && (
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
