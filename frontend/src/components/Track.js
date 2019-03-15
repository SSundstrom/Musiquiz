/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// TODO FIX
import * as React from 'react';
import PropTypes from 'prop-types';
import TrackStyles from './styles/TrackStyles';

const Track = ({ onClick, track }) => (
  <React.Fragment>
    {track && (
      <TrackStyles onClick={onClick}>
        {!track.album.images.length - 1 && <img alt="Album img" src={track.album.images[track.album.images.length - 1].url} />}
        <div className="trackinfo">
          <div className="trackname">{track.name}</div>
          <div className="trackartists">
            {track.artists.map((artist, index) => (
              <span key={artist.name}>{`${artist.name}${index !== track.artists.length - 1 ? ', ' : ''}`}</span>
            ))}
          </div>
        </div>
      </TrackStyles>
    )}
  </React.Fragment>
);
Track.propTypes = {
  onClick: PropTypes.func,
  track: PropTypes.object.isRequired,
};
Track.defaultProps = {
  onClick: () => {},
};
export default Track;
