/* global window */

import React, { useContext } from 'react';
import LogRocket from 'logrocket';
import Scores from '../../components/Scores';
import Track from '../../components/Track';
import { GameContext } from '../../game-context';
import Settings from '../../components/Settings';
import HostScreenStyles from '../../components/styles/HostScreenStyles';
import QR from '../../components/QR';
import QueueStyles from '../../components/styles/QueueStyles';

const HostStarted = () => {
  const context = useContext(GameContext);
  const { state } = context;
  const { correctSong, players, name, gamestate, leader, guessTimer, leaderTimer, songToPlay } = state;
  LogRocket.identify('Host', { room: name });
  const nonLeaders = players.filter(p => p.active && p.nickname !== leader.nickname);

  const { onKickPlayer } = context;
  return (
    <HostScreenStyles>
      <div className="qr">
        <QR name={name} className="qr" size={256} value={`${window.location.href.replace('#', '')}${state.name}`} />
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
                  .map(player => (
                    <div className="queue-label">{player.nickname}</div>
                  ))}
              </React.Fragment>
            )}
            {players.filter(p => !p.active).length > 0 && (
              <React.Fragment>
                <hr />
                <div>Inactive:</div>
                {players
                  .filter(p => !p.active)
                  .sort()
                  .map(player => (
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
          {gamestate !== 'midgame' && correctSong && (
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

export default HostStarted;
