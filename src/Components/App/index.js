import "./index.css";
import React from "react";
import { SearchBar } from "../SearchBar";
import { SearchResults } from "../SearchResults";
import { Playlist } from "../Playlist";
export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [
        { name: "Taler", artist: "Talerartist", album: "TalerAlbum", id: "" },
      ],
      playlistName: "T",
      playlistTracks: [
        { name: "Taler", artist: "Talerartist", album: "TalerAlbum", id: "" },
      ],
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
  }
  addTrack(track) {
    if (
      this.state.playlistTracks.find((savedTrack) => savedTrack.id === track.id)
    ) {
      return;
    }
    const newPlayListTracks = this.state.playlistTracks;
    newPlayListTracks.push(track);
    this.setState({ playlistTracks: newPlayListTracks });
  }
  removeTrack(track) {
    const newPlayListTracks = this.state.playlistTracks.filter(
      (savedTrack) => savedTrack.id !== track.id
    );
    this.setState({ playlistTracks: newPlayListTracks });
  }
  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }
  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              name={this.state.playlistName}
              tracks={this.state.playlistTracks}
              onRemove={this.state.removeTrack}
              onNameChange={this.updatePlaylistName}
            />
          </div>
        </div>
      </div>
    );
  }
}
