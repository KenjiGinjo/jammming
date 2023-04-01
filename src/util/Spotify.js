const clientId = "67d3459787b74aeb9a062f2964de05a6";
const redirectUrl = "https://ad-slope.surge.sh";

let accessToken = "";
let expiresIn = "";
const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else {
      const access_token = window.location.href.match(/access_token=([^&]*)/);
      const expires_in = window.location.href.match(/expires_in=([^&]*)/);
      if (access_token && expires_in) {
        accessToken = access_token[1];
        expiresIn = expires_in[1];
        window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
        window.history.pushState("Access Token", null, "/");
      } else {
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUrl}`;
      }
    }
  },
  async search(term) {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=${term}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const res = await response.json();
      return res.tracks.items.map((track) => {
        return {
          id: track.id,
          name: track.name,
          track: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        };
      });
    } catch (err) {
      console.log(err);
    }
  },
  async savePlaylist(playlistName, trackURIs) {
    if (playlistName && trackURIs) {
      try {
        const userIdresponse = await fetch(`https://api.spotify.com/v1/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const userIdRes = await userIdresponse.json();
        const playlistResponse = await fetch(
          `https://api.spotify.com/v1/users/${userIdRes.id}/playlists`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify({
              name: playlistName,
            }),
          }
        );
        const playlistRes = await playlistResponse.json();
        await fetch(
          `https://api.spotify.com/v1/playlists/${
            playlistRes.id
          }/tracks?uri=${trackURIs.join(",")}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify({
              uris: trackURIs,
            }),
          }
        );
        alert(
          `Your play list: ${playlistName} has been stored in Spotify Cloud!`
        );
        return;
      } catch (err) {
        console.log(err);
      }
    } else {
      return;
    }
  },
};

export default Spotify;
