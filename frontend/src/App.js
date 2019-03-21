import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog, faSignOutAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ThemeProvider } from 'emotion-theming';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import { theme, GlobalSyles } from './constants/styling';
import Home from './pages/Home';
import Join from './pages/Join';
import Player from './pages/Player';
import Host from './pages/Host';
import GameProvider from './game-context';
import Footer from './components/Footer';
import Background from './components/Background';

LogRocket.init('bdomyd/dwims');
setupLogRocketReact(LogRocket);
library.add(faCog);
library.add(faTimes);
library.add(faSignOutAlt);

const App = () => (
  <ThemeProvider theme={theme}>
    <GameProvider>
      <GlobalSyles />
      <Router>
        <Background>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/join" component={Join} />
            <Route path="/host" component={Host} />
            <Route path="/play" component={Player} />
            <Redirect to="/" />
          </Switch>
          <Footer />
        </Background>
      </Router>
    </GameProvider>
  </ThemeProvider>
);
export default App;
