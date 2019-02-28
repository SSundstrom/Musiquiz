/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// TODO FIX
import * as React from 'react';
import PropTypes from 'prop-types';

const Track = ({ onClick, track }) => (
  <React.Fragment>
    {track && (
      <div className="coverArt" onClick={onClick}>
        <div className="trackitem">
          {!track.album.images.length - 1 && (
            <img alt="Album img" src={track.album.images[track.album.images.length - 1].url} />
          )}
          <div className="trackinfo">
            <div className="trackname">
              {' '}
              {track.name}
              {' '}
            </div>
            <div className="trackartists">
              {' '}
              {track.artists.map(artist => (
                <span key={artist.name}>
                  {artist.name}
                  {' '}
                </span>
              ))}
              {' '}
            </div>
          </div>
        </div>
      </div>
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
