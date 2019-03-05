import React, { Component } from 'react';
import SpotifyPlayer, { auth } from '../playback';
import Button from '../components/styles/Button';
import GameStyles from '../components/styles/GameStyles';
import { GameConsumer, GameContext } from '../game-context';

class JoinOrCreateRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: '',
      name: '',
    };
  }

  componentDidMount() {
    const { context } = this;
    if (SpotifyPlayer.access_token) {
      context.onJoinAsHost();
    }
  }

  handleChange(event) {
    const field = event.target.name;
    const value = event.target.type === 'number' ? parseInt(event.target.value, 10) : event.target.value;
    this.setState({ [field]: value });
  }

  render() {
    const { name, nickname } = this.state;
    return (
      <GameConsumer>
        {context => (
          <GameStyles>
            <form
              onSubmit={e => {
                e.preventDefault();
                context.onJoinAsPlayer(nickname, name);
                return false;
              }}
            >
              <label htmlFor="nickname">
                Nickname
                <input id="nickname" value={nickname} onChange={this.handleChange.bind(this)} type="text" name="nickname" />
              </label>
              <label htmlFor="name">
                Room code
                <input id="name" value={name} onChange={this.handleChange.bind(this)} type="number" min="1000" max="9999" name="name" />
              </label>
              <Button type="submit" value="Join" />
            </form>
            <Button type="button" onClick={() => auth()} value="Start a new game" />
          </GameStyles>
        )}
      </GameConsumer>
    );
  }
}
JoinOrCreateRoom.contextType = GameContext;
export default JoinOrCreateRoom;
