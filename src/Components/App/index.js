import "./index.css";
import React from "react";
import { SearchBar } from "../SearchBar";
import { SearchResults } from "../SearchResults";
import { Playlist } from "../Playlist";
import Spotify from "../../util/Spotify";
import { seachResult, playListHistory } from "../../util/Spotify";
const noticeHandleThings = () => {
  alert("We are at loading status! Please wait..");
};
export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: [],
      loading: false,
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  addTrack(track) {
    if (this.state.loading) {
      noticeHandleThings();
      return;
    }
    if (
      this.state.playlistTracks.find((savedTrack) => savedTrack.id === track.id)
    ) {
      return;
    }
    const newPlayListTracks = this.state.playlistTracks;
    newPlayListTracks.push(track);
    const newSearchResults = this.state.searchResults.filter(
      (t) => t.id !== track.id
    );
    playListHistory.set(this.state.playlistName, newPlayListTracks);
    seachResult.set(newSearchResults);
    this.setState({
      playlistTracks: newPlayListTracks,
      searchResults: newSearchResults,
    });
  }
  removeTrack(track) {
    if (this.state.loading) {
      noticeHandleThings();
      return;
    }
    const newPlayListTracks = this.state.playlistTracks.filter(
      (savedTrack) => savedTrack.id !== track.id
    );
    const newSearchResults = this.state.searchResults;
    newSearchResults.push(track);
    playListHistory.set(this.state.playlistName, newPlayListTracks);
    seachResult.set(newSearchResults);
    this.setState({
      playlistTracks: newPlayListTracks,
      searchResults: newSearchResults,
    });
  }
  updatePlaylistName(name) {
    playListHistory.set(name, this.state.playlistTracks);
    this.setState({ playlistName: name });
  }
  async savePlaylist() {
    if (this.state.loading) {
      noticeHandleThings();
      return;
    }
    this.setState({ loading: true });
    const trackURIs = this.state.playlistTracks.map((track) => track.uri);
    await Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({ loading: false });
  }
  async search(term) {
    const res = await Spotify.search(term);
    seachResult.set(res);
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
    if (seachResult.get()) {
      this.setState({ searchResults: seachResult.get() });
    }
    const pHistory = playListHistory.get();
    if (pHistory.name) {
      this.setState({
        playlistName: pHistory.name,
      });
    }
    if (pHistory.list?.length > 0) {
      this.setState({
        playlistTracks: pHistory.list,
      });
    }
  }
}
