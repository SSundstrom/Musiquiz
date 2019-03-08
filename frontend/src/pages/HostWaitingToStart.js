/* global window */
import React from 'react';
import Players from '../components/Players';
import GameStyles from '../components/styles/GameStyles';
import { GameConsumer } from '../game-context';
import QR from '../components/QR';

const HostWaitingToStart = () => (
  <GameConsumer>
    {context => (
      <React.Fragment>
        <QR size={256} renderAs="svg" value={`${window.location.href.replace('#', '')}${context.state.name}`} />
        <GameStyles>
          <h2>Waiting for players</h2>
          <h2>{`Room code: ${context.state.name}`}</h2>
          <Players />
        </GameStyles>
      </React.Fragment>
    )}
  </GameConsumer>
);

export default HostWaitingToStart;
