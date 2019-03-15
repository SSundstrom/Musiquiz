/* global window */
import React, { useEffect, useContext, useState } from 'react';
import styled from '@emotion/styled';
import SpotifyPlayer, { auth } from '../playback';
import Button from '../components/styles/Button';
import PlayerStyles from '../components/styles/PlayerStyles';
import { GameContext } from '../game-context';

const NicknameContainer = styled.div`
  display: grid;
  grid-template-columns: 9fr 1fr;
`;

const LuckyButton = styled(Button)`
  max-width: 100%;
  min-width: 0px;
  padding: 0;
  border: none;
  font-size: 30px;
  margin-top: 10px;
`;
const JoinOrCreateRoom = () => {
  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const context = useContext(GameContext);
  const { state } = context;
  const { nickname: contextNickname } = state;
  useEffect(() => {
    const roomName = parseInt(window.location.pathname.replace('/', ''), 10);
    if (roomName) {
      setName(roomName);
    }
    if (SpotifyPlayer.access_token) {
      context.onJoinAsHost();
    }
  }, []);

  useEffect(() => {
    setNickname(contextNickname);
  }, [contextNickname]);
  return (
    <PlayerStyles>
      <form
        onSubmit={e => {
          e.preventDefault();
          context.onJoinAsPlayer(nickname, name);
          return false;
        }}
      >
        <label htmlFor="nickname">
          Nickname
          <NicknameContainer>
            <input id="nickname" value={nickname} onChange={event => setNickname(event.target.value)} type="text" name="nickname" />
            <div>
              <LuckyButton type="button" value="🍀" onClick={() => context.lucky(name)} />
            </div>
          </NicknameContainer>
        </label>
        <label htmlFor="name">
          Room code
          <input
            id="name"
            value={name}
            onChange={event => setName(parseInt(event.target.value, 10))}
            onPaste={event => setName(parseInt(event.target.value, 10))}
            type="number"
            min="1000"
            max="9999"
            name="name"
          />
        </label>
        <Button type="submit" value="Join" />
      </form>
      <Button type="button" onClick={() => auth()} value="Start a new game" />
    </PlayerStyles>
  );
};

JoinOrCreateRoom.contextType = GameContext;
export default JoinOrCreateRoom;
