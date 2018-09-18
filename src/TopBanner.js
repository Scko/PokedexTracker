import React from 'react';
import './TopBanner.css';
import logo from './logo.svg';

class TopBanner extends React.Component {
    render() {
        return (
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="App-title">Pokedex Tracker</h1>
            </header>
        );
    }
}

export default TopBanner;