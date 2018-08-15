/*
- [x] Make the Play button work
- [x] Make the Pause button work
- [x] Disable the play button if it's playing
- [x] Disable the pause button if it's not playing
- [x] Make the PlayPause button work
- [ ] Make the JumpForward button work
- [ ] Make the JumpBack button work
- [ ] Make the progress bar work
  - change the width of the inner element to the percentage of the played track
  - add a click handler on the progress bar to jump to the clicked spot

Here is the audio API you'll need to use, `audio` is the <audio/> dom nod
instance, you can access it as `this.audio` in `AudioPlayer`

```js
// play/pause
audio.play()
audio.pause()

// change the current time
audio.currentTime = audio.currentTime + 10
audio.currentTime = audio.currentTime - 30

// know the duration
audio.duration

// values to calculate relative mouse click position
// on the progress bar
event.clientX // left position *from window* of mouse click
const rect = node.getBoundingClientRect()
rect.left // left position *of node from window*
rect.width // width of node
```

Other notes about the `<audio/>` tag:

- You can't know the duration until `onLoadedData`
- `onTimeUpdate` is fired when the currentTime changes
- `onEnded` is called when the track plays through to the end and is no
  longer playing

Good luck!
*/

import "./index.css";
import React from "react";
import * as PropTypes from "prop-types";
import podcast from "./podcast.mp4";
import mario from "./mariobros.mp3";
import FaPause from "react-icons/lib/fa/pause";
import FaPlay from "react-icons/lib/fa/play";
import FaRepeat from "react-icons/lib/fa/repeat";
import FaRotateLeft from "react-icons/lib/fa/rotate-left";

const AudioContext = React.createContext();

class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      play: () => {
        this.setState({ playing: true }, () => {
          this.audio.play();
        });
      },
      pause: () =>
        this.setState({ playing: false }, () => {
          this.audio.pause();
        })
    };
  }
  render() {
    this.audio && this.audio.play();
    return (
      <div className="audio-player">
        <audio
          src={this.props.source}
          onTimeUpdate={null}
          onLoadedData={null}
          onEnded={null}
          ref={n => {
            this.audio = n;
          }}
        />
        <AudioContext.Provider value={this.state}>
          {this.props.children}
        </AudioContext.Provider>
      </div>
    );
  }
}

class Play extends React.Component {
  render() {
    return (
      <AudioContext.Consumer>
        {({ play, playing }) => {
          return (
            <button
              className="icon-button"
              onClick={play}
              disabled={playing}
              title="play"
            >
              <FaPlay />
            </button>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

class Pause extends React.Component {
  render() {
    return (
      <AudioContext.Consumer>
        {({ pause, playing }) => (
          <button
            className="icon-button"
            onClick={pause}
            disabled={!playing}
            title="pause"
          >
            <FaPause />
          </button>
        )}
      </AudioContext.Consumer>
    );
  }
}

class PlayPause extends React.Component {
  render() {
    return (
      <AudioContext.Consumer>
        {({ playing }) => (playing ? <Pause /> : <Play />)}
      </AudioContext.Consumer>
    );
  }
}

class JumpForward extends React.Component {
  render() {
    return (
      <button
        className="icon-button"
        onClick={null}
        disabled={null}
        title="Forward 10 Seconds"
      >
        <FaRepeat />
      </button>
    );
  }
}

class JumpBack extends React.Component {
  render() {
    return (
      <button
        className="icon-button"
        onClick={null}
        disabled={null}
        title="Back 10 Seconds"
      >
        <FaRotateLeft />
      </button>
    );
  }
}

class Progress extends React.Component {
  render() {
    return (
      <div className="progress" onClick={null}>
        <div
          className="progress-bar"
          style={{
            width: "23%"
          }}
        />
      </div>
    );
  }
}

const Exercise = () => (
  <div className="exercise">
    <AudioPlayer source={mario}>
      <PlayPause /> <span className="player-text">Mario Bros. Remix</span>
      <Progress />
    </AudioPlayer>

    <AudioPlayer source={podcast}>
      <PlayPause /> <JumpBack /> <JumpForward />{" "}
      <span className="player-text">Workshop.me Podcast Episode 02</span>
      <Progress />
    </AudioPlayer>
  </div>
);

export default Exercise;
