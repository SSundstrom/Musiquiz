import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { search as trackSearch } from '../api';
import Track from '../components/Track';
import RecommendedSongs from '../components/RecommendedSongs';

class LeaderChooseSong extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      results: [],
    };
  }

  onChange(value) {
    this.setState({
      value,
    });

    this.search(value);
  }

  search(value) {
    if (value.length < 2) {
      return this.setState({
        results: [],
      });
    }

    trackSearch(value, (results) => {
      if (value === this.state.value) {
        this.setState({ results });
      }
    });
  }

  render() {
    const { value, results } = this.state;
    const { onSelectSong, name } = this.props;
    return (
      <div className="game">
        <label>
          <h2>Dude, enter a song name</h2>
          <input type="text" onChange={e => this.onChange(e.currentTarget.value)} value={value} />
        </label>
        {value.length > 0
          && results.map(track => <Track track={track} onClick={() => onSelectSong(track)} />)}
        {value.length === 0 && <RecommendedSongs name={name} onSelectSong={onSelectSong} />}
      </div>
    );
  }
}

LeaderChooseSong.propTypes = {
  onSelectSong: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default LeaderChooseSong;
