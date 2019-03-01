import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SpotifyPlayer, { auth } from '../playback';

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
      <div>
        <label>Nickname</label>
        <input
          value={nickname}
          onChange={this.handleChange.bind(this)}
          type="text"
          name="nickname"
        />
        <label>Room code</label>
        <input
          value={room}
          onChange={this.handleChange.bind(this)}
          type="number"
          min="1000"
          max="9999"
          name="room"
        />
        <button type="button" className="button" onClick={() => onJoinAsPlayer(nickname, room)}>
          Join
        </button>
        <button type="button" className="button" onClick={() => auth()}>
          Start a new game
        </button>
      </div>
    );
  }
}
JoinOrCreateRoom.propTypes = {
  onJoinAsPlayer: PropTypes.func.isRequired,
  onJoinAsHost: PropTypes.func.isRequired,
};
export default JoinOrCreateRoom;
