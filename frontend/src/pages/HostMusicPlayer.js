import React, { Component } from 'react';
import Scores from '../components/Scores'
import Track from '../components/Track'
import SpotifyPlayer from '../playback';

class HostMusicPlayer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      devices:[],
      selectedDevice:null
    }
  }
  componentDidMount() {
    this.getDevices()
  }

  componentWillReceiveProps(newProps) {
    if (this.props.songToPlay !== newProps.songToPlay) {
      console.log('Playing ' + newProps.songToPlay);
      this.playSong(newProps.songToPlay);
    }
  }

  playSong(uri) {
    SpotifyPlayer.controls.play([uri]);
  }

  render() {
    const track = this.props.correctSong
    return (
      <div>
        {console.log(this.state.devices)}

        {this.state.devices.length > 0 && this.renderDevices()}
        <h1>{this.props.correctSongTimer}</h1>

        {track && (<div>The correct song was... <Track track={track}/></div>)}            
        
        <div><Scores score={this.props.score}/></div>
      </div>
      
    );
  }
  renderDevices() {
    
    return (
      <select value={this.state.selectedDevice} onChange = {(e) => this.changeDevice(e.target.value)}>
      {this.state.devices.map((device) => {
        console.log(device)
        return <option key={device.id} value={device.id}>{device.name}</option>
      })}
    </select>
    )
  }
  changeDevice(id) {
    console.log(id)
    SpotifyPlayer.controls.switchPlayback(id);
    this.setState({selectedDevice:id})
  }

  getDevices() {
    SpotifyPlayer.controls.getDevices((results) => {
      var id;
      console.log(results)
      for (var i in this.state.devices) {
        if (this.state.devices[i].is_active) {
          id = this.state.devices[i].id
          break
        }
      }
      this.setState({devices:results, selectedDevice:id})
    })
  }
}

export default HostMusicPlayer;