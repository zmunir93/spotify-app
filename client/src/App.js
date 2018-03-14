import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';

const defaultStyle = {
  color: '#fff',
  'font-family': 'Papyrus'
};

const counterStyle = {...defaultStyle, 
  width: "40%", 
  display: 'inline-block',
  'margin-bottom': '20px',
  'font-size': '20px',
  'line-height': '30px'
}

// class PlaylistCounter extends Component {
//   render() {
//     return (
//       <div style={{...defaultStyle, width: "40%", display: 'inline-block'}}>
//         <h2>{this.props.playlists.length} playlist</h2>
//       </div>
//     );
//   }
// }

class HoursCounter extends Component {
  render() {
    const allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs)
    }, [])
    const totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0)
    return (
      <div style={{...defaultStyle, width: "40%", display: 'inline-block'}}>
        <h2>{Math.round(totalDuration/60)} hours</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={defaultStyle}>
        <img/>
        <input type="text" onKeyUp={event =>
          this.props.onTextChange(event.target.value)}/>
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    const playlist = this.props.playlist
    return (
      <div style={{...defaultStyle, color: 'black', display: 'inline-block', width: "25%"}}>
        <img src={playlist.imageURL} style={{width: '320px'}}/>
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs.map(song =>
            <li>{song.name}</li>
          )}
        </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {},
      filterString: ''
    }
  }

  componentDidMount() {
    const parsed = queryString.parse(window.location.hash);
    const accessToken = parsed.access_token;
    if (!accessToken)
      return;

    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
      .then(data => this.setState({
        user: {
          name: data.display_name
        }
      }))

    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => this.setState({
      playlists: data.items.map(item => {
        console.log(data.items)
        return {
          name: item.name,
          imageURL: item.images[0].url,
          songs: []
        }
      })
    }))

  }




  render() {
    const playlistToRender = 
      this.state.user && 
        this.state.playlists 
          ? this.state.playlists.filter(playlist =>
            playlist.name.toLowerCase().includes(
              this.state.filterString.toLowerCase())) 
          : []

    return (
    <div className='App'>
      {this.state.user ?
      <div>
        <h1 style={{...defaultStyle, 'font-size': '54px', 'color': 'black'}}>
          {this.state.user.name}'s Playlists
          </h1>
        {/* <PlaylistCounter playlist={playlistToRender}/>
         <HoursCounter playlist={playlistToRender}/>  */}
        <Filter onTextChange={text => {
          this.setState({filterString: text})
        }}/>
      {playlistToRender.map(playlist =>
        <Playlist playlist={playlist} />
        )}
        </div> : <button onClick={() => window.location = 'http://localhost:8888'}>Sign in with Spotify</button>
      }
    </div>
    );
  }
}

export default App;
