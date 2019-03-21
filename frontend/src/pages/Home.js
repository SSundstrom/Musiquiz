/* global window */
import React, { useEffect, useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import styled from '@emotion/styled';
import SpotifyPlayer from '../playback';
import Button from '../components/styles/Button';
import HomeStyles from '../components/styles/HomeStyles';
import { GameContext } from '../game-context';

const Input = styled.input`
  text-align: center;
`;
const Home = () => {
  const [name, setName] = useState('');
  const context = useContext(GameContext);

  useEffect(() => {
    const roomName = parseInt(window.location.pathname.replace('/', ''), 10);
    if (roomName) {
      setName(roomName);
    }
    if (SpotifyPlayer.access_token) {
      context.onJoinAsHost();
    }
  }, []);
  if (SpotifyPlayer.access_token) {
    return <Redirect to="/host" />;
  }
  return (
    <HomeStyles>
      <form
        onSubmit={e => {
          e.preventDefault();
          context.onJoinAsPlayer(name);
          return false;
        }}
      >
        <label htmlFor="name">
          Enter a room code
          <Input
            placeholder="Room code"
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
    </HomeStyles>
  );
};

export default Home;
