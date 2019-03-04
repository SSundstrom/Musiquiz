import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Z_FULL_FLUSH } from 'zlib';
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
    const { time, devices } = this.state;
    const { correctSong, onChangeTimer, correctSongTimer, players, name } = this.props;
    return (
      <div>
        {devices.length > 0 && this.renderDevices()}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onChangeTimer(time);
            return false;
          }}
        >
          <h2>{`Room code: ${name}`}</h2>
          <label>
            Time
            <input
              className="timer-input"
              type="number"
              onChange={e => this.setState({ time: e.currentTarget.value })}
              value={time}
              step="1"
              min="1"
              max="180"
            />
            <input className="button, timer-button" type="submit" value="Change" />
          </label>
        </form>

        <h1>{correctSongTimer}</h1>

        {correctSong && (
          <div>
            The correct song was...
            {' '}
            <Track track={correctSong} />
          </div>
        )}

        <div>
          <Scores players={players} />
        </div>
      </div>
    );
  }
}
HostMusicPlayer.propTypes = {
  correctSong: PropTypes.object,
  onChangeTimer: PropTypes.any.isRequired,
  correctSongTimer: PropTypes.any,
  players: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
};

HostMusicPlayer.defaultProps = {
  correctSong: null,
  correctSongTimer: '',
};

export default HostMusicPlayer;
