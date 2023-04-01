import "./index.css";
import React from "react";

export class Track extends React.Component {
  // name: "", artist: "", album: "", id: ""
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }
  addTrack() {
    this.props.onAdd(this.props.track);
  }
  removeTrack() {
    this.props.onRemove(this.props.track);
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
    return (
      <div className="Track">
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
}
