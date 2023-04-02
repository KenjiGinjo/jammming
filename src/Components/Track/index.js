import "./index.css";
import React from "react";

export class Track extends React.Component {
  // name: "", artist: "", album: "", id: ""
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.playPreview = this.playPreview.bind(this);
    this.state = {
      play: false,
    };
    this.audio = new Audio(this.props.track.preview_url);
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }
  removeTrack() {
    this.props.onRemove(this.props.track);
  }
  playPreview() {
    this.setState({ play: !this.state.play }, () => {
      this.state.play ? this.audio.play() : this.audio.pause();
    });
  }
  render() {
    const button = this.props.isRemoval ? (
      <button className="Track-action" onClick={this.removeTrack}>
        -
      </button>
    ) : (
      <button className="Track-action" onClick={this.addTrack}>
        +
      </button>
    );
    const audio = (
      <div className="Track-preview">
        <img
          src={this.props.track.thumb}
          alt={this.props.track.name}
          onClick={this.playPreview}
        />
      </div>
    );
    return (
      <div className="Track">
        {audio}
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>
            {this.props.track.artist}|{this.props.track.album}
          </p>
        </div>

        {button}
      </div>
    );
  }
  componentDidMount() {
    this.audio.addEventListener("ended", () => this.setState({ play: false }));
  }

  componentWillUnmount() {
    this.audio.removeEventListener("ended", () =>
      this.setState({ play: false })
    );
  }
}
