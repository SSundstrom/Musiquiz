import { useContext } from 'react';
import { HostContext } from '../context/hostContext';

const useHost = () => {
  const context = useContext(HostContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export default useHost;
