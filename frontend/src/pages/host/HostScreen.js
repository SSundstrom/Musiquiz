import React, { useContext } from 'react';
import HostStarted from './HostStarted';
import HostWaiting from './HostWaiting';
import { GameContext } from '../../game-context';

const HostScreen = () => {
  const context = useContext(GameContext);
  const {
    state: { started, name },
  } = context;
  if (!started) {
    return <HostWaiting name={name} />;
  }
  return <HostStarted />;
};

export default HostScreen;
