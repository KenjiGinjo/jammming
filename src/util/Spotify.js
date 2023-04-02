const clientId = "67d3459787b74aeb9a062f2964de05a6";
const redirectUrl = "https://ad-slope.surge.sh";
// const redirectUrl = "http://localhost:3000";

const accessToken = {
  get() {
    return localStorage.getItem("access_token");
  },
  set(token) {
    localStorage.setItem("access_token", token);
  },
  remove() {
    localStorage.removeItem("access_token");
  },
};

const expiresIn = {
  get() {
    return localStorage.getItem("expire_in");
  },
  set(time) {
    localStorage.setItem("expire_in", time);
  },
  remove() {
    localStorage.removeItem("expire_in");
  },
};

const userId = {
  get() {
    return localStorage.getItem("user_id");
  },
  set(token) {
    localStorage.setItem("user_id", token);
  },
  remove() {
    localStorage.removeItem("user_id");
  },
};

export const seachResult = {
  get() {
    return JSON.parse(localStorage.getItem("search_result"));
  },
  set(result) {
    localStorage.setItem("search_result", JSON.stringify(result));
  },
  remove() {
    localStorage.removeItem("search_result");
  },
};

export const playListHistory = {
  get() {
    return {
      name: localStorage.getItem("play_list_name"),
      list: JSON.parse(localStorage.getItem("play_list")),
    };
  },
  set(name, result) {
    localStorage.setItem("play_list_name", name);
    localStorage.setItem("play_list", JSON.stringify(result));
  },
  remove() {
    localStorage.removeItem("play_list");
  },
};

const Spotify = {
  getAccessToken() {
    if (accessToken.get()) {
      if (new Date().getTime() > expiresIn.get()) {
        accessToken.remove();
        expiresIn.remove();
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUrl}`;
      } else {
        return accessToken.get();
      }
    } else {
      const access_token = window.location.href.match(/access_token=([^&]*)/);
      const expires_in = window.location.href.match(/expires_in=([^&]*)/);
      if (access_token && expires_in) {
        accessToken.set(access_token[1]);
        const expireInTime = new Date().getTime() + expires_in[1] * 1000;
        expiresIn.set(expireInTime);
        window.history.pushState("Access Token", null, "/");
        return access_token;
      } else {
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUrl}`;
      }
    }
  },
  async getUserId() {
    if (userId.get()) {
      return userId.get();
    } else {
      const res = await request(`https://api.spotify.com/v1/me`);
      userId.set(res.id);
      return res.id;
    }
  },
  async search(term) {
    if (!term) {
      alert("You should search sth");
      return;
    }
    const res = await request(
      `https://api.spotify.com/v1/search?type=track&q=${term}`
    );
    const result = res.tracks.items.map((track) => {
      return {
        id: track.id,
        name: track.name,
        track: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
        thumb: track.album.images[2].url,
        preview_url: track.preview_url,
      };
    });
    return result;
  },
  async savePlaylist(playlistName, trackURIs) {
    if (playlistName && trackURIs.length > 0) {
      try {
        const user_id = await this.getUserId();
        const playlistInfo = await request(
          `https://api.spotify.com/v1/users/${user_id}/playlists`,
          "POST",
          {
            name: playlistName,
          }
        );

        await request(
          `https://api.spotify.com/v1/playlists/${
            playlistInfo.id
          }/tracks?uri=${trackURIs.join(",")}`,
          "POST",
          {
            uris: trackURIs,
          }
        );
        alert(
          `Your play list: ${playlistName} has been stored in Spotify Cloud!`
        );
        return;
      } catch (err) {
        alert(err);
      }
    } else {
      alert(`Your play list or your play list name shouldn't be empty`);
      return;
    }
  },
};

const request = async (url, method, data) => {
  let otherObj = {};
  if (method) {
    otherObj.method = method;
  }
  if (data) {
    otherObj.body = JSON.stringify(data);
  }
  const accessToken = Spotify.getAccessToken();
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    ...otherObj,
  });
  if ([400].includes(response.status)) {
    throw new Error("Server error");
  }
  if (response.ok) {
    return await response.json();
  }
  throw new Error("Network error");
};

export default Spotify;
