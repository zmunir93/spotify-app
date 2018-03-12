import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';

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
    console.log(accessToken);

    fetch('https://api.spotify.com/v1/me', {headers: {'Authorization': 'Bearer ' + accessToken}
  }).then(response => response.json()).then(data => this.setState({server}));
  }




  render() {
    return (
    <div className='App'>
      <a href='http://localhost:8888'> Login to Spotify </a>
    </div>
    );
  }
}

export default App;
