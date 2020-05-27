/* global window */
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/styles/Button';
import HomeStyles from '../components/styles/HomeStyles';
import useHost from '../hooks/useHost';
import usePlayer from '../hooks/usePlayer';
import SpotifyPlayer from '../playback';

const Input = styled.input`
  text-align: center;
`;
const Home = () => {
  const [name, setName] = useState<string>('');
  const host = useHost();
  const player = usePlayer();

  if (SpotifyPlayer.access_token) {
    return <Redirect to="/host" />;
  }

  if (player.state.name) {
    return <Redirect to="/join" />;
  }

  return (
    <HomeStyles>
      {player.state.roomNotFound && <div>Room not found</div>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          player.onJoinRoom(name);
          return false;
        }}
      >
        <label htmlFor="name">
          Enter a room code
          <Input
            placeholder="Room code"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            // onPaste={event => setName(event.target.value)}
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
