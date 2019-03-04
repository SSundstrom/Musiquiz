import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Scores from '../components/Scores';
import Track from '../components/Track';
import SpotifyPlayer from '../playback';

class HostMusicPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      selectedDevice: SpotifyPlayer.device_id,
      time: 30,
      penalty: 0,
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
    SpotifyPlayer.controls.getDevices((results) => {
      this.setState({ devices: results, selectedDevice: id });
    });
  }

  handleChange(event) {
    const field = event.target.name;
    const value = event.target.type === 'number' ? parseInt(event.target.value, 10) : event.target.value;
    this.setState({ [field]: value });
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
    const { settings, penalty, time, devices } = this.state;
    const {
      correctSong,
      onSaveSettings,
      onKickPlayer,
      correctSongTimer,
      players,
      name,
    } = this.props;
    return (
      <React.Fragment>
        <div className="game">
          {devices.length > 0 && this.renderDevices()}
          <h2>{`Room code: ${name}`}</h2>

          <h1>{correctSongTimer}</h1>

          {correctSong && (
            <div>
              The correct song was...
              {' '}
              <Track track={correctSong} />
            </div>
          )}
          <div>
            <Scores isHost kick={settings} players={players} onKickPlayer={onKickPlayer} />
          </div>
        </div>
        <div className="settings">
          {settings ? (
            <React.Fragment>
              <h2 className="settings-header">
                Settings
                <button
                  onClick={() => this.setState({
                    settings: !settings,
                  })
                  }
                  className="icon"
                  type="button"
                >
                  <FontAwesomeIcon icon="times" />
                </button>
              </h2>
              <form
                className="settings-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  onSaveSettings({ time, penalty });
                  return false;
                }}
              >
                <div>
                  <label className="setting" htmlFor="time">
                    Round time:
                    <input
                      id="time"
                      name="time"
                      className="timer-input"
                      type="number"
                      onChange={this.handleChange.bind(this)}
                      value={time}
                      step="1"
                      min="1"
                      max="180"
                    />
                  </label>
                  <label className="setting" htmlFor="penalty">
                    Bad song penalty:
                    <input
                      id="penalty"
                      name="penalty"
                      className="timer-input"
                      type="number"
                      onChange={this.handleChange.bind(this)}
                      value={penalty}
                      step="1"
                      min="0"
                      max="180"
                    />
                  </label>
                </div>
                <input className="button" type="submit" value="Save settings" />
              </form>
            </React.Fragment>
          ) : (
            <div className="settings">
              <button
                onClick={() => this.setState({
                  settings: !settings,
                })
                }
                type="button"
                className="icon"
              >
                <FontAwesomeIcon icon="cog" />
              </button>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}
HostMusicPlayer.propTypes = {
  correctSong: PropTypes.object,
  onSaveSettings: PropTypes.func.isRequired,
  onKickPlayer: PropTypes.func.isRequired,
  correctSongTimer: PropTypes.any,
  players: PropTypes.array.isRequired,
  name: PropTypes.number.isRequired,
};

HostMusicPlayer.defaultProps = {
  correctSong: null,
  correctSongTimer: '',
};

export default HostMusicPlayer;
