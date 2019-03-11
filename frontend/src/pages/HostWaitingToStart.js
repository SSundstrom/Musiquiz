/* global window */
import React from 'react';
import Players from '../components/Players';
import { GameConsumer } from '../game-context';
import QR from '../components/QR';
import HostScreenStyles from '../components/styles/HostScreenStyles';

const HostWaitingToStart = () => (
  <GameConsumer>
    {context => (
      <HostScreenStyles>
        <QR className="qr" size={256} value={`${window.location.href.replace('#', '')}${context.state.name}`} />
        <div className="game">
          <h1>Waiting for players</h1>
          <h1>{`Room code: ${context.state.name}`}</h1>
          <Players />
        </div>
      </HostScreenStyles>
    )}
  </GameConsumer>
);

export default HostWaitingToStart;
