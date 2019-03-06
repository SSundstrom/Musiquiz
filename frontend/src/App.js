import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ThemeProvider } from 'emotion-theming';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import { theme, GlobalSyles } from './constants/styling';
import Game from './Game';

import Layout from './components/Layout';
import { GameProvider } from './game-context';

LogRocket.init('bdomyd/dwims');
setupLogRocketReact(LogRocket);
LogRocket.identify('Index', {});
library.add(faCog);
library.add(faTimes);

const App = () => (
  <ThemeProvider theme={theme}>
    <GameProvider>
      <GlobalSyles />
      <Layout>
        <Game />
      </Layout>
    </GameProvider>
  </ThemeProvider>
);
export default App;
