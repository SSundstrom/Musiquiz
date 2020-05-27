import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import useHost from '../hooks/useHost';
import SpotifyPlayer from '../playback';
import Button from './styles/Button';
import IconButton from './styles/IconButton';
import SettingsStyles from './styles/SettingsStyles';

const Settings = (props) => {
  const [state, setState] = useState({
    devices: [],
    time: 30,
    leaderTime: 10,
    penalty: 0,
    maxPoints: 50,
    minPoints: 10,
    // selectedDevice: SpotifyPlayer.device_id,
  });
  const context = useHost();
  const playSong = (uri) => {
    const { selectedDevice } = state;
    console.log('playing', selectedDevice);
    SpotifyPlayer.controls.play([uri], selectedDevice);
  };

  const updateDevices = async () => {
    const devices = await SpotifyPlayer.controls.getDevices();
    setState({ ...state, devices });
  };
  const changeDevice = (id) => {
    SpotifyPlayer.controls.switchPlayback(id);
    setState({ ...state, selectedDevice: id });
    console.log(id);
    updateDevices();
  };
  useEffect(() => {
    if (context.state.songToPlay) {
      playSong(context.state.songToPlay);
    }
  }, [context.state.songToPlay]);
  useEffect(() => {
    changeDevice(SpotifyPlayer.device_id);
    SpotifyPlayer.controls.play(['spotify:track:1DCNcPA0Y9ukY5AlXAZKUm'], SpotifyPlayer.device_id);
  }, []);

  const { devices, selectedDevice, penalty, leaderTime, time, minPoints, maxPoints } = state;

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
          <select value={selectedDevice} onChange={(e) => changeDevice(e.target.value)}>
            {devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))}
          </select>
          <form
            className="settings-form"
            onSubmit={(e) => {
              e.preventDefault();

              context.onSaveSettings({ time, leaderTime, penalty, minPoints, maxPoints });
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
                onChange={(event) =>
                  setState({ ...state, time: event.target.type === 'number' ? parseInt(event.target.value, 10) : event.target.value })
                }
                value={time}
                step="1"
                min="1"
                max="180"
              />
            </label>
            <label className="setting" htmlFor="leaderTime">
              Leader timeout:
              <input
                id="leaderTime"
                name="leaderTime"
                className="timer-input"
                type="number"
                onChange={(event) =>
                  setState({ ...state, leaderTime: event.target.type === 'number' ? parseInt(event.target.value, 10) : event.target.value })
                }
                value={leaderTime}
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
                onChange={(event) =>
                  setState({ ...state, penalty: event.target.type === 'number' ? parseInt(event.target.value, 10) : event.target.value })
                }
                value={penalty}
                step="1"
                min="0"
                max="180"
              />
            </label>
            <label className="setting" htmlFor="minPoints">
              Min points:
              <input
                id="minPoints"
                name="minPoints"
                className="timer-input"
                type="number"
                onChange={(event) =>
                  setState({ ...state, minPoints: event.target.type === 'number' ? parseInt(event.target.value, 10) : event.target.value })
                }
                value={minPoints}
                step="1"
                min="0"
                max="180"
              />
            </label>
            <label className="setting" htmlFor="maxPoints">
              Max points:
              <input
                id="maxPoints"
                name="maxPoints"
                className="timer-input"
                type="number"
                onChange={(event) =>
                  setState({ ...state, maxPoints: event.target.type === 'number' ? parseInt(event.target.value, 10) : event.target.value })
                }
                value={maxPoints}
                step="1"
                min="0"
                max="180"
              />
            </label>
            <Button type="submit" value="Save settings" />
          </form>
        </div>
      ) : (
        <IconButton
          className="cog"
          onClick={() => {
            context.onShowSettings();
          }}
          type="button"
        >
          <FontAwesomeIcon icon="cog" />
        </IconButton>
      )}
    </SettingsStyles>
  );
};
export default Settings;
