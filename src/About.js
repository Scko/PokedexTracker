import React from "react";
import './About.css';

const About = () => {
    return (
        <div className="center">
            <h1>Welcome to DexList!</h1>
            The point of this app is to act as a checklist for catching pokemon. It can also be used to look up basic information 
            on a pokemon too. There is no logging in, and all data is stored locally on your browser. Data on the pokemon is pulled from  
            <a href="https://pokeapi.co/"> Poke API</a>. 
        </div>
        );
};

export default About;