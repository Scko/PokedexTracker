import React from "react";
import { Link, Route, Switch } from "react-router-dom";

import About from "./About";
import DexList from "./DexList";
import Pokemon from "./Pokemon";
import './Root.css';
import logo from './pokeball.svg';


const Root = () => {
    return (
        <div>
            <div>
                <header className="App-header" style={{ display: `flow-root` }}>
                    <div className="center">
                        <img src={logo} className="App-logo" alt="logo" />
                        <div>
                            <h2 className="App-title"> <Link to="/dexlist">DexList</Link></h2>
                            <h2 className="App-title"> <Link to="/about">About</Link></h2>
                        </div>
                    </div>

                    
                </header>
            </div>
            
            <Switch>
                <Route component={About} path="/about" />
                <Route component={DexList} path="/dexlist" exact />
                <Route component={DexList} path="/" exact />
                <Route component={Pokemon} path='/dexlist/:pokemonName' />
            </Switch>
        </div>
    );
};

export default Root;