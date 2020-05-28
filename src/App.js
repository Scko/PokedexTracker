import React, { Component } from 'react';
import './App.css';
import DexList from './DexList';

class App extends Component {
    constructor(props) {
        super(props);
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
