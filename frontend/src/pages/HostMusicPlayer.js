import React, { Component } from 'react';
import Scores from '../components/Scores'
import Track from '../components/Track'
import SpotifyPlayer from '../playback';

class HostMusicPlayer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      devices:[],
      selectedDevice:SpotifyPlayer.device_id,
      time:30
    }
  }
  componentDidMount() {
    this.updateDevices(SpotifyPlayer.device_id)
    this.playSong('spotify:track:1DCNcPA0Y9ukY5AlXAZKUm')
  }

  componentWillReceiveProps(newProps) {
    if (this.props.songToPlay !== newProps.songToPlay) {
      console.log('Playing ' + newProps.songToPlay);
      this.playSong(newProps.songToPlay);
    }
  }

  playSong(uri) {
    SpotifyPlayer.controls.play([uri], this.state.selectedDevice);
  }

  render() {
    const track = this.props.correctSong
    return (
      <div>
        {this.state.devices.length > 0 && this.renderDevices()}
        
        <form onSubmit={(e) => { e.preventDefault(); this.props.onChangeTimer(this.state.time); return false; }}>
          <label>
            Time
            <input className="timer-input"
              type="number" 
              onChange={(e) => this.setState({time: e.currentTarget.value})} 
              value={this.state.time}
              step="5"
              min="15"
              max="180"
            />
            <input className="button, timer-button" type="submit" value="Change" />
          </label>
        </form>

        <h1>{this.props.correctSongTimer}</h1>

        {track && (<div>The correct song was... <Track track={track}/></div>)}            
 
        <div><Scores score={this.props.score} nickname={this.props.nickname} oldScore={this.props.oldScore}/></div>
      </div>
      
    );
  }
  renderDevices() {
    
    return (
      <select value={this.state.selectedDevice} onChange = {(e) => this.changeDevice(e.target.value)}>
      {this.state.devices.map((device) => {
        return <option key={device.id} value={device.id}>{device.name}</option>
      })}
    </select>
    )
  }
  changeDevice(id) {
    console.log(id)
    SpotifyPlayer.controls.switchPlayback(id)
    this.updateDevices(id)
  }

  updateDevices(id) {
    SpotifyPlayer.controls.getDevices((results) => {
      this.setState({devices:results, selectedDevice:id})
    })
  }
}

export default HostMusicPlayer;