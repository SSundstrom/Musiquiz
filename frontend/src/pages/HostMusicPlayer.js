import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Scores from '../components/Scores';
import Track from '../components/Track';
import SpotifyPlayer from '../playback';
import GameStyles from '../components/styles/GameStyles';
import { GameConsumer } from '../game-context';
import Settings from '../components/Settings';

class HostMusicPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      selectedDevice: SpotifyPlayer.device_id,
      settings: false,
    };
  }

  componentDidMount() {
    this.updateDevices(SpotifyPlayer.device_id);
    this.playSong('spotify:track:1DCNcPA0Y9ukY5AlXAZKUm');
  }

  componentWillReceiveProps(newProps) {
    const { songToPlay } = this.props;
    if (songToPlay !== newProps.songToPlay) {
      console.log(`Playing ${newProps.songToPlay}`);
      this.playSong(newProps.songToPlay);
    }
  }

  playSong(uri) {
    const { selectedDevice } = this.state;
    SpotifyPlayer.controls.play([uri], selectedDevice);
  }

  changeDevice(id) {
    console.log(id);
    SpotifyPlayer.controls.switchPlayback(id);
    this.updateDevices(id);
  }

  updateDevices(id) {
    SpotifyPlayer.controls.getDevices(results => {
      this.setState({ devices: results, selectedDevice: id });
    });
  }

  renderDevices() {
    const { selectedDevice, devices } = this.state;
    return (
      <select value={selectedDevice} onChange={e => this.changeDevice(e.target.value)}>
        {devices.map(device => (
          <option key={device.id} value={device.id}>
            {device.name}
          </option>
        ))}
      </select>
    );
  }

  render() {
    const { settings, devices } = this.state;

    return (
      <GameConsumer>
        {context => {
          const { correctSong, players, name } = context.state;
          const { onKickPlayer, correctSongTimer } = context;
          return (
            <React.Fragment>
              <GameStyles>
                {devices.length > 0 && this.renderDevices()}
                <h2>{`Room code: ${name}`}</h2>
                <h1>{correctSongTimer}</h1>
                {correctSong && (
                  <div>
                    <span>The correct song was...</span>
                    <Track track={correctSong} />
                  </div>
                )}
                <div>
                  <Scores isHost kick={settings} players={players} onKickPlayer={onKickPlayer} />
                </div>
              </GameStyles>
              <Settings />
            </React.Fragment>
          );
        }}
      </GameConsumer>
    );
  }
}
HostMusicPlayer.propTypes = {
  songToPlay: PropTypes.string,
};

HostMusicPlayer.defaultProps = {
  songToPlay: null,
};

export default HostMusicPlayer;
