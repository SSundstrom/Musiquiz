/* global window */

import React, { useContext } from 'react';
import Scores from '../components/Scores';
import Track from '../components/Track';
import { GameContext } from '../game-context';
import Settings from '../components/Settings';
import HostScreenStyles from '../components/styles/HostScreenStyles';
import QR from '../components/QR';
import QueueStyles from '../components/styles/QueueStyles';

const leaderSort = (first, second) => first.leader / first.rounds - second.leader / second.rounds;
const HostScreen = () => {
  const context = useContext(GameContext);

  const { state } = context;
  const { correctSong, players, name, gamestate, leader, guessTimer, songToPlay } = state;
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
            {players.length > 1 && (
              <div className="queue-heading">
                <div className="queue-label">Next:</div>
                <div className="queue-name">{players.filter(p => p.active).sort(leaderSort)[1].nickname}</div>
              </div>
            )}
            {players.length > 2 && (
              <React.Fragment>
                <hr />
                <div>Queue:</div>
                {players
                  .filter((p, index) => p.active && index > 1)
                  .sort(leaderSort)
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

export default HostScreen;
