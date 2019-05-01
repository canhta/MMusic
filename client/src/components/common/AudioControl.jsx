import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import formatTime from '../../api/formatTime';
import './AudioControl.css';
export class AudioControl extends Component {
  static propTypes = {
    prop: PropTypes
  };

  constructor(props) {
    super(props);
    this.ref_Audio = React.createRef();
    this.state = {
      isPlaying: false,
      progress: 0,
      volume: 1,
      isMuted: false,
      src:
        'https://res.cloudinary.com/dx6o8ihdt/video/upload/v1556555057/media/music/k29g5pacrrocjilqal5f.mp3'
    };
    this.is_progress_dirty = false;
    this.interval_id = setInterval(this.onUpdate.bind(this), 250);
  }
  componentDidMount() {
    this.ref_Audio.current.src = this.state.src;
    console.log(this.ref_Audio);
  }
  onUpdate() {
    if (this.ref_Audio.current) {
      if (!this.is_progress_dirty) {
        this.setState({
          progress:
            this.ref_Audio.current.currentTime / this.ref_Audio.current.duration
        });
      }

      if (this.ref_Audio.current.ended && this.props.onDone) {
        this.props.onDone(this.props.src);
      }
    }
  }

  togglePlay() {
    const currentState = this.state.isPlaying;
    this.setState({ isPlaying: !currentState });
  }
  toggleVolumePlus() {
    if (this.ref_Audio.current.volume >= 0.9) {
      this.setState({ volume: 1 });
      this.ref_Audio.current.volume = 1;
    } else {
      this.setState(state => ({ volume: state.volume + 0.1 }));
      this.ref_Audio.current.volume += 0.1;
    }
  }
  toggleVolumeSub() {
    if (this.ref_Audio.current.volume <= 0.1) {
      this.setState({ volume: 0 });
      this.ref_Audio.current.volume = 0;
    } else {
      this.setState(state => ({ volume: state.volume - 0.1 }));
      this.ref_Audio.current.volume -= 0.1;
    }
  }
  toggleVolumeMute() {
    this.setState({ isMuted: !this.state.isMuted });
  }
  render() {
    let currentTime = 0;
    let totalTime = 0;
    const { src, isPlaying, volume, isMuted } = this.state;
    if (this.ref_Audio.current) {
      if (this.ref_Audio.current.currentSrc !== src) {
        this.ref_Audio.current.src = src;
      }
      if (isPlaying) {
        this.ref_Audio.current.play();
      } else if (!isPlaying) {
        this.ref_Audio.current.pause();
      }
      this.ref_Audio.current.muted = isMuted;

      currentTime = this.ref_Audio.current.currentTime;
      totalTime = this.ref_Audio.current.duration;
    }

    return (
      <div>
        <audio ref={this.ref_Audio} src={src} type="audio/*" />
        <div>
          <button onClick={() => this.togglePlay()}>
            {!isPlaying ? 'PLAY' : 'PAUSE'}
          </button>
          <button onClick={() => this.toggleVolumePlus()}>Vol+</button>
          <button>{Math.floor(volume * 100)}</button>
          <button onClick={() => this.toggleVolumeSub()}>Vol-</button>
          <button onClick={() => this.toggleVolumeMute()}>
            {isMuted ? 'ON' : 'MUTE'}
          </button>
          <button>
            {formatTime(currentTime)} / {formatTime(totalTime)}
          </button>
          <progress
            className="media-progress"
            value={this.state.progress}
            max="1"
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioControl);
