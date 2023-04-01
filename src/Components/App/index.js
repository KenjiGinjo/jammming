import "./index.css";
import React from "react";
import { SearchBar } from "../SearchBar";
import { SearchResults } from "../SearchResults";
import { Playlist } from "../Playlist";
import Spotify from "../../util/Spotify";
export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: [],
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
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
  async savePlaylist() {
    const trackURIs = this.state.playlistTracks.map((track) => track.uri);
    await Spotify.savePlaylist(this.state.playlistName, trackURIs);
  }
  async search(term) {
    const res = await Spotify.search(term);
    this.setState({ searchResults: res });
  }
  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              name={this.state.playlistName}
              tracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    Spotify.getAccessToken();
  }
}
