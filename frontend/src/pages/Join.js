import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/styles/Button';
import JoinStyles from '../components/styles/JoinStyles';
import usePlayer from '../hooks/usePlayer';

const LuckyButton = styled(Button)`
  min-width: 0px;
  padding: 0;
  border: none;
  font-size: 30px;
  margin: 0;
  margin-bottom: 20px;
  align-self: end;
`;
const Input = styled.input`
  text-align: center;
`;
const Join = () => {
  const [nickname, setNickname] = useState('');
  const player = usePlayer();
  const {
    state: { nickname: contextNickname, name, joined },
  } = player;

  useEffect(() => {
    if (contextNickname) {
      setNickname(contextNickname);
    }
  }, [contextNickname]);
  console.log(player);
  if (!name) {
    return <Redirect to="/" />;
  }
  if (joined) {
    return <Redirect to="/play" />;
  }
  return (
    <JoinStyles>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          player.onJoinAsPlayer(nickname, name);
        }}
      >
        <label htmlFor="nickname" className="input">
          Enter a nickname
          <Input
            placeholder="Nickname"
            id="nickname"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            type="text"
            name="nickname"
          />
        </label>
        <LuckyButton className="lucky" type="button" value="🍀" onClick={() => player.lucky(name)} />
        <Button className="input" type="submit" value="Join" />
      </form>
    </JoinStyles>
  );
};

export default Join;
