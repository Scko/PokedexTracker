import React, { Component } from 'react';
import './App.css';
import { BrowserRouter } from "react-router-dom";
import Root from './Root';

class App extends Component {
  render() {
      return (
          <BrowserRouter>
              <div className="App">
                  <Root />
              </div>
          </BrowserRouter>
     
    );
  }
}

export default App;
