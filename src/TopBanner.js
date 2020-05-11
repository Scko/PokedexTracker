import React from 'react';
import './TopBanner.css';
import logo from './logo.svg';
import DexList from './DexList';

class TopBanner extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            displayDexList: props.displayDexList,
            displayMenu: false
        };
    }
    render() {
        return (
            <div>
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="App-title">Pokedex Tracker</h1>
                    
                    <h2><button onClick={() => { this.setState({ displayMenu: true }); }}></button>Tracker</h2>
                        <h2>DexList</h2>
                        <h2>ItemList</h2>
                
                </header>
                <DexList displayItems={false} displayMenu={this.state.displayMenu} displayDexList={false} displayTracker={false} />
            </div>

        );
    }
}

export default TopBanner;