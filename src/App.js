import React, { Component } from 'react';
import './App.css';
import TopBanner from './TopBanner';
import DexList from './DexList';

class App extends Component {
  render() {
    return (
      <div className="App">
        <TopBanner />
        <DexList />
      </div>
    );
  }
}

export default App;
