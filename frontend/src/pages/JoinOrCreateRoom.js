/* global window */
import React, { useEffect, useContext, useState } from 'react';
import styled from '@emotion/styled';
import SpotifyPlayer, { auth } from '../playback';
import Button from '../components/styles/Button';
import ContentStyles from '../components/styles/ContentStyles';
import { GameContext } from '../game-context';

import Field from '../components/Field';
import useField from './hooks/useField';

const LuckyButton = styled(Button)`
  max-width: 100%;
  min-width: 0px;
  padding: 0;
  border: none;
  font-size: 30px;
  margin-bottom: 0;
  margin-top: 10px;
`;
const JoinOrCreateRoom = () => {
  const context = useContext(GameContext);
  const { state } = context;
  const { nickname: contextNickname, roomNotFound, playerAlreadyExists } = state;
  const [formSubmitted, setFormSubmitted] = useState(false);
  const nicknameField = useField('nickname', {
    defaultValue: '',
    validations: [value => value.length === 0 && 'Nickname required', () => playerAlreadyExists && 'Player already exists'],
  });
  const nameField = useField('name', {
    defaultValue: '',
    validations: [value => value.length === 0 && 'Room code required', () => roomNotFound && 'Room not found'],
  });
  useEffect(() => {
    const roomName = parseInt(window.location.pathname.replace('/', ''), 10);
    if (roomName) {
      nameField.setValue(roomName);
    }
    if (SpotifyPlayer.access_token) {
      context.onJoinAsHost();
    }
  }, []);
  useEffect(() => {
    if (contextNickname) {
      nicknameField.setValue(contextNickname);
    }
  }, [contextNickname]);

  useEffect(() => {
    if (nameField.pristine) return;
    nameField.validate();
  }, [roomNotFound]);

  useEffect(() => {
    if (nicknameField.pristine) return;
    nicknameField.validate();
  }, [playerAlreadyExists]);

  const luckyButton = (
    <LuckyButton
      type="button"
      value="🍀"
      onClick={() => {
        nicknameField.validate();
        nameField.validate();
        context.lucky(parseInt(nameField.value, 10));
      }}
    />
  );
  return (
    <ContentStyles>
      <div>
        <form
          onSubmit={e => {
            e.preventDefault();
            context.onJoinAsPlayer(nicknameField.value, parseInt(nameField.value, 10));
            setFormSubmitted(true);
            nameField.validate();
            nicknameField.validate();
          }}
        >
          <Field
            id="name"
            label="Enter room code"
            placeholder="Room code"
            type="number"
            min="1000"
            max="9999"
            name="name"
            formSubmitted={formSubmitted}
            onChange={event => {
              context.clearRoomNotFound();
              nameField.onChange(event);
            }}
            {...nameField}
          />

          <Field
            label="Choose a nickname"
            placeholder="Nickname"
            id="nickname"
            type="text"
            name="nickname"
            button={luckyButton}
            onChange={event => {
              context.clearPlayerAlreadyExists();
              nicknameField.onChange(event);
            }}
            formSubmitted={formSubmitted}
            {...nicknameField}
          />
          <Button type="submit" value="Join" />
        </form>
      </div>
      <Button type="button" onClick={() => auth()} value="Start a new game" />
    </ContentStyles>
  );
};

export default JoinOrCreateRoom;
