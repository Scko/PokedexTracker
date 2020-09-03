import React from "react";
import { Link, Route, Switch } from "react-router-dom";

import About from "./About";
import DexList from "./DexList";
import Pokemon from "./Pokemon";
import './Root.css';
import logo from './pokeball.svg';

class Root extends React.Component {
    myFunction() {
        var x = document.getElementById("myTopnav");
        if (x.className === "topnav") {
            x.className += " responsive";
        } else {
            x.className = "topnav";
        }
    }

    render() {
        return (
            <div>
                <header className="App-header">
                    <div className="topnav" id="myTopnav" >
                        <div className="center">
                            <img src={logo} className="App-logo" alt="logo" />
                            <Link to="/dexlist">DexList</Link>
                            <Link to="/about">About</Link>
                            <a href="javascript:void(0);" className="icon" onClick={() => { this.myFunction(); }}>&#9776;</a>
                        </div>
                </div>
                </header>
                <Switch>
                    <Route component={About} path="/about" />
                    <Route component={DexList} path="/dexlist" exact />
                    <Route component={DexList} path="/" exact />
                    <Route component={Pokemon} path='/dexlist/:pokemonName' />
                </Switch>
            </div>
        );
    };
}
export default Root;