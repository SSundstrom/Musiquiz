import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SettingsStyles from './styles/SettingsStyles';
import IconButton from './styles/IconButton';
import { GameContext } from '../game-context';
import Button from './styles/Button';

const Settings = () => {
  const [time, changeTime] = useState(30);
  const [penalty, changePenalty] = useState(0);
  const context = useContext(GameContext);
  const { state } = context;
  return (
    <SettingsStyles>
      {state.showSettings ? (
        <div className="settings">
          <h2 className="settings-header">
            Settings
            <IconButton onClick={() => context.onShowSettings()} type="button">
              <FontAwesomeIcon icon="times" />
            </IconButton>
          </h2>
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
                onChange={event => changeTime(event.target.type === 'number' ? parseInt(event.target.value, 10) : event.target.value)}
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
                onChange={event => changePenalty(event.target.type === 'number' ? parseInt(event.target.value, 10) : event.target.value)}
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
        <IconButton onClick={() => context.onShowSettings()} type="button">
          <FontAwesomeIcon icon="cog" />
        </IconButton>
      )}
    </SettingsStyles>
  );
};

export default Settings;
