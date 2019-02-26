import React, { Component } from 'react';
import styled from '@emotion/styled';
import SpotifyPlayer, { auth } from '../playback';

class JoinOrCreateRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: '',
      room: '',
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
    const { value } = event.target;
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
        <input value={room} onChange={this.handleChange.bind(this)} type="text" name="room" />
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

export default JoinOrCreateRoom;
