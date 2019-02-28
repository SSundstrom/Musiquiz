import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getAudioAnalysis } from '../api';
import Track from './Track';

class RecommendedSongs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
    };
  }

  componentDidMount() {
    const { name } = this.props;
    getAudioAnalysis(name, (data) => {
      console.log(data);
      this.setState({
        results: data,
      });
    });
  }

  render() {
    const { results } = this.state;
    const { onSelectSong } = this.props;
    return (
      <div>
        <div> Suggestions </div>
        {results.map(track => (
          <Track key={track.uri} track={track} onClick={() => onSelectSong(track)} />
        ))}
      </div>
    );
  }
}
RecommendedSongs.propTypes = {
  onSelectSong: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};
export default RecommendedSongs;
