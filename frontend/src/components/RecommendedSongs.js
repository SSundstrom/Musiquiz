import React, { Component } from 'react';
import { getAudioAnalysis } from '../api';
import Track from './Track';
import { GameContext, GameConsumer } from '../game-context';

class RecommendedSongs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
    };
  }

  componentDidMount() {
    const { context } = this;

    getAudioAnalysis(context.state.name, data => {
      this.setState({
        results: data,
      });
    });
  }

  render() {
    const { results } = this.state;
    return (
      <GameConsumer>
        {context => (
          <div>
            <div> Suggestions </div>
            {results.map(track => (
              <Track key={track.uri} track={track} onClick={() => context.onSelectSong(track)} />
            ))}
          </div>
        )}
      </GameConsumer>
    );
  }
}

RecommendedSongs.contextType = GameContext;
export default RecommendedSongs;
