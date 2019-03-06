import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { search as trackSearch } from '../api';
import Track from './Track';
import RecommendedSongs from './RecommendedSongs';

class Search extends Component {
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

  search(searchString) {
    if (searchString.length < 2) {
      this.setState({
        results: [],
      });
    } else {
      trackSearch(searchString, results => {
        const { value } = this.state;
        if (searchString === value) {
          this.setState({ results });
        }
      });
    }
  }

  render() {
    const { results, value } = this.state;
    const { recommendations, onSelectSong, title, name } = this.props;
    return (
      <div>
        <label htmlFor="song-title">
          {title}
          <input id="song-title" type="text" onChange={e => this.onChange(e.currentTarget.value)} value={value} />
        </label>
        {results.map(track => (
          <Track track={track} onClick={() => onSelectSong(track)} />
        ))}
        {recommendations && value.length === 0 && <RecommendedSongs name={name} onSelectSong={onSelectSong} />}
      </div>
    );
  }
}
Search.propTypes = {
  onSelectSong: PropTypes.func.isRequired,
  recommendations: PropTypes.bool,
  name: PropTypes.number,
  title: PropTypes.string,
};
Search.defaultProps = {
  title: '',
  recommendations: false,
  name: -1,
};
export default Search;
