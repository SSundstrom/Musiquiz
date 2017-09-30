import * as React from 'react';

const Track = (props) => (
  <div className="coverArt" onClick={props.onClick}>
        <div className="trackitem">
          <img src={props.track.album.images[props.track.album.images.length-1].url}/>
          <div className="trackinfo">
            <div className="trackname"> {props.track.name} </div>
            <div className="trackartists"> {props.track.artists.map(artist => <span>{artist.name }</span>)} </div>
          </div>
        </div>
  </div>
);

export default Track;