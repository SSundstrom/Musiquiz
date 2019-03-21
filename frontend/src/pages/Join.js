import React, { useEffect, useContext, useState } from 'react';
import styled from '@emotion/styled';
import Button from '../components/styles/Button';
import JoinStyles from '../components/styles/JoinStyles';
import { GameContext } from '../game-context';

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

  const context = useContext(GameContext);
  const {
    state: { nickname: contextNickname, name },
  } = context;

  useEffect(() => {
    if (contextNickname) {
      setNickname(contextNickname);
    }
  }, [contextNickname]);
  return (
    <JoinStyles>
      <form
        onSubmit={e => {
          e.preventDefault();
          context.onJoinAsPlayer(nickname, name);
          return false;
        }}
      >
        <label htmlFor="nickname" className="input">
          Enter a nickname
          <Input
            placeholder="Nickname"
            id="nickname"
            value={nickname}
            onChange={event => setNickname(event.target.value)}
            type="text"
            name="nickname"
          />
        </label>
        <LuckyButton className="lucky" type="button" value="🍀" onClick={() => context.lucky(name)} />
        <Button className="input" type="submit" value="Join" />
      </form>
    </JoinStyles>
  );
};

export default Join;
