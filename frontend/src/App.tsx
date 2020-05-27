import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog, faSignOutAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Background from './components/Background';
import Footer from './components/Footer';
import { GlobalSyle, theme } from './constants/styling';
import HostProvider from './context/hostContext';
import PlayerContext from './context/playerContext';
import Home from './pages/Home';
import Host from './pages/Host';
import Join from './pages/Join';
import Player from './pages/Player';
import Start from './pages/Start';

LogRocket.init('bdomyd/dwims');
setupLogRocketReact(LogRocket);
library.add(faCog);
library.add(faTimes);
library.add(faSignOutAlt);

const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalSyle />
    <PlayerContext>
      <HostProvider>
        <Router>
          <Background>
            <Switch>
              <Route path="/callback" component={Start} />
              <Route path="/host" component={Host} />
              <Route path="/play" component={Player} />
              <Route path="/join" component={Join} />
              <Route path="/" exact component={Home} />
            </Switch>
            <Footer />
          </Background>
        </Router>
      </HostProvider>
    </PlayerContext>
  </ThemeProvider>
);
export default App;
