import React, { Component } from 'react';
import './App.css';
import TopBanner from './TopBanner';
import DexList from './DexList';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            displayMenu: false,
            displayDexList: true,
            displayItems: false,
            displayPokemon: false,
            displayItem: false,
            displayTracker: false,
        };
    }

  render() {
    return (
      <div className="App">
        <DexList />
      </div>
    );
  }
}

export default App;
