import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SpotifyPlayer, { auth } from '../playback';
import Button from '../components/styles/Button';
import GameStyles from '../components/styles/GameStyles';

class JoinOrCreateRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: undefined,
      room: undefined,
    };
  }

  componentDidMount() {
    const { onJoinAsHost } = this.props;
    if (SpotifyPlayer.access_token) {
      onJoinAsHost();
    }
  }

  handleChange(event) {
    const field = event.target.name;
    const value = event.target.type === 'number' ? parseInt(event.target.value, 10) : event.target.value;
    this.setState({ [field]: value });
  }

  render() {
    const { onJoinAsPlayer } = this.props;
    const { room, nickname } = this.state;
    return (
      <GameStyles>
        <form
          onSubmit={e => {
            e.preventDefault();
            onJoinAsPlayer(nickname, room);
            return false;
          }}
        >
          <label htmlFor="nickname">
            Nickname
            <input id="nickname" value={nickname} onChange={this.handleChange.bind(this)} type="text" name="nickname" />
          </label>
          <label htmlFor="room">
            Room code
            <input id="room" value={room} onChange={this.handleChange.bind(this)} type="number" min="1000" max="9999" name="room" />
          </label>
          <Button type="submit" value="Join" />
        </form>
        <Button type="button" onClick={() => auth()} value="Start a new game" />
      </GameStyles>
    );
  }
}
JoinOrCreateRoom.propTypes = {
  onJoinAsPlayer: PropTypes.func.isRequired,
  onJoinAsHost: PropTypes.func.isRequired,
};
export default JoinOrCreateRoom;
