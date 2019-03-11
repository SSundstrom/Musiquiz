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
      <div className="qr">
        <QR name={name} className="qr" size={256} value={`${window.location.href.replace('#', '')}${state.name}`} />
        {players && (
          <div className="leader-queue">
            {players.length > 0 && <p>{`Choosing now: ${players[0].nickname}`}</p>}
            {players.length > 1 && <p>{`Next: ${players[1].nickname}`}</p>}
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
          </div>
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
