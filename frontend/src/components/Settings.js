import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SettingsStyles from './styles/SettingsStyles';
import IconButton from './styles/IconButton';
import { GameConsumer } from '../game-context';
import Button from './styles/Button';

const Settings = () => {
  const [settings, changeSettings] = useState(false);
  const [time, changeTime] = useState(30);
  const [penalty, changePenalty] = useState(0);

  return (
    <GameConsumer>
      {context => (
        <SettingsStyles>
          {settings ? (
            <div className="settings">
              <h2 className="settings-header">
                Settings
                <IconButton onClick={() => changeSettings(!settings)} type="button">
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
            <IconButton onClick={() => changeSettings(!settings)} type="button">
              <FontAwesomeIcon icon="cog" />
            </IconButton>
          )}
        </SettingsStyles>
      )}
    </GameConsumer>
  );
};

export default Settings;
