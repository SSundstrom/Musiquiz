import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SettingsStyles from './styles/SettingsStyles';
import IconButton from './styles/IconButton';
import { GameConsumer } from '../game-context';
import Button from './styles/Button';
import SpotifyPlayer from '../playback';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      time: 30,
      penalty: 0,
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

  render() {
    const { devices, selectedDevice } = this.state;
    return (
      <GameConsumer>
        {context => {
          const { penalty, time } = this.state;
          return (
            <SettingsStyles>
              {context.state.showSettings ? (
                <div>
                  <h2 className="settings-header">
                    Settings
                    <IconButton onClick={() => context.onShowSettings()} type="button">
                      <FontAwesomeIcon icon="times" />
                    </IconButton>
                  </h2>
                  <select value={selectedDevice} onChange={e => this.changeDevice(e.target.value)}>
                    {devices.map(device => (
                      <option key={device.id} value={device.id}>
                        {device.name}
                      </option>
                    ))}
                  </select>
                  <form
                    className="settings-form"
                    onSubmit={e => {
                      e.preventDefault();
                      context.onSaveSettings({ time, penalty });
                      return false;
                    }}
                  >
                    <label className="setting" htmlFor="time">
                      Round time:
                      <input
                        id="time"
                        name="time"
                        className="timer-input"
                        type="number"
                        onChange={event =>
                          this.setState({ time: event.target.type === 'number' ? parseInt(event.target.value, 10) : event.target.value })
                        }
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
                        onChange={event =>
                          this.setState({ penalty: event.target.type === 'number' ? parseInt(event.target.value, 10) : event.target.value })
                        }
                        value={penalty}
                        step="1"
                        min="0"
                        max="180"
                      />
                    </label>
                    <Button type="submit" value="Save settings" />
                  </form>
                </div>
              ) : (
                <IconButton className="cog" onClick={() => context.onShowSettings()} type="button">
                  <FontAwesomeIcon icon="cog" />
                </IconButton>
              )}
            </SettingsStyles>
          );
        }}
      </GameConsumer>
    );
  }
}

export default Settings;
