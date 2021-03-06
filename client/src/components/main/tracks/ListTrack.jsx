/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import { PlayCircleOutline } from '@material-ui/icons';

const ListTrack = props => {
  const { tracks, playSong } = props;

  return (
    <div className="container" style={{ marginTop: 20 }}>
      <ul className="list-unstyled list_music">
        {tracks &&
          tracks.length > 0 &&
          tracks.map((track, key) => {
            return (
              <div key={key}>
                <li
                  style={{
                    borderRadius: 10,
                    backgroundColor: '#e0e0e0',
                    marginBottom: 15
                  }}
                  className="media align-items-stretch items-stretch-2013458"
                >
                  <div className="media_tmp align-self-center d-flex align-items-center mr-3 pl-3">
                    <span className="counter">{key + 1}</span>
                  </div>
                  <div className="media-left align-items-stretch mr-2">
                    <img
                      style={{
                        marginRight: 10,
                        borderRadius: 10,
                        width: 130,
                        height: 'auto'
                      }}
                      src={track.image}
                      alt={track.name}
                    />
                  </div>
                  <div className="media-body align-items-stretch d-flex flex-column justify-content-between p-0">
                    <div>
                      <h5
                        onClick={() => playSong(track)}
                        className="media-title mt-0 mb-0 title_home_tablet"
                        style={{ cursor: 'pointer' }}
                      >
                        <PlayCircleOutline /> {track.name}
                      </h5>
                      <div className="author title_home_tablet">
                        <a href="#">
                          {track.artists
                            .map(art => {
                              return art.name;
                            })
                            .join('; ')}
                        </a>
                      </div>
                    </div>
                    <small className="type_music">
                      <span className="card-text" style={{ color: 'red' }}>
                        {track.format.toUpperCase()}
                      </span>
                    </small>
                  </div>
                </li>
              </div>
            );
          })}
      </ul>
    </div>
  );
};

ListTrack.propTypes = {
  playSong: PropTypes.func.isRequired
};

export default ListTrack;
