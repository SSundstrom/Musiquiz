/* global window */

import LogRocket from 'logrocket';
import React, { useEffect } from 'react';
import QR from '../components/QR';
import Scores from '../components/Scores';
import Settings from '../components/Settings';
import HostScreenStyles from '../components/styles/HostScreenStyles';
import QueueStyles from '../components/styles/QueueStyles';
import Track from '../components/Track';
import useHost from '../hooks/useHost';
import { auth } from '../playback';
import { GameState } from '../types';

const Host = () => {
  const context = useHost();
  const { state } = context;
  const { correctSong, players, name, gamestate, leader, guessTimer, leaderTimer, songToPlay } = state;
  LogRocket.identify('Host', { room: name });
  const nonLeaders = leader ? players.filter((p) => p.active && p.nickname !== leader.nickname) : players;
  const { onKickPlayer } = context;
  useEffect(() => {
    auth();
    context.onJoinAsHost();
  }, []);

  return (
    <HostScreenStyles>
      <div className="qr">
        {name && <QR name={name} className="qr" size={256} value={`${state.name}`} />}
        {players && (
          <QueueStyles>
            {leader && (
              <div className="queue-heading">
                <div className="queue-label">Choosing now:</div>
                <div className="queue-name">{leader.nickname}</div>
              </div>
            )}
            {nonLeaders.length > 0 && (
              <div className="queue-heading">
                <div className="queue-label">Next:</div>
                <div className="queue-name">{nonLeaders[0].nickname}</div>
              </div>
            )}
            {nonLeaders.length > 1 && (
              <React.Fragment>
                <hr />
                <div>Queue:</div>
                {nonLeaders
                  .filter((p, index) => index > 0)
                  .map((player) => (
                    <div className="queue-label">{player.nickname}</div>
                  ))}
              </React.Fragment>
            )}
            {players.filter((p) => !p.active).length > 0 && (
              <React.Fragment>
                <hr />
                <div>Inactive:</div>
                {players
                  .filter((p) => !p.active)
                  .sort()
                  .map((player) => (
                    <div className="queue-label">{player.nickname}</div>
                  ))}
              </React.Fragment>
            )}
          </QueueStyles>
        )}
      </div>
      <div className="game">
        {gamestate === 'choose' && <h1>{`Waiting for ${leader.nickname}`}</h1>}
        {leaderTimer > 0 && <h1>{`Reconnect within ${leaderTimer} seconds`}</h1>}
        {guessTimer > 0 && <h1>{`Time left: ${guessTimer}`}</h1>}
        <div className="content">
          {gamestate !== GameState.MIDGAME && correctSong && (
            <div>
              <span>The correct song was...</span>
              <Track track={correctSong} />
            </div>
          )}
          <Scores isHost players={players} onKickPlayer={onKickPlayer} />
        </div>
      </div>
      <Settings songToPlay={songToPlay} />
    </HostScreenStyles>
  );
};

export default Host;
