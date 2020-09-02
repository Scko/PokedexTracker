import React from "react";
import './DexList.css';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';
import { MDBDataTable } from 'mdbreact';
import { Link } from "react-router-dom";

class DexList extends React.Component{

    constructor(props) {
        super(props); 

        this.state = {
            pokemonNames: [],
            renderedPokemon : {
                columns: [
                    {
                        label: 'Caught',
                        field: 'caught',
                    },
                    {
                        label: 'Name',
                        field: 'name',
                    }
                ],
                rows: []
            },
            renderedMoves: {
                columns: [
                    { label: 'Name', field: 'name' },
                    { label: 'Level', field: 'level' },
                    { label: 'Method', field: 'method' },
                    { label: 'Version', field: 'version' }
                ],
                rows: []
            },
            displayPokemon: false,
            displayTracker: true,
            width: 0,
            height: 0,
        };

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }
    
    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        this.getPokemonNames();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    getPokemonNames(){
        let alreadyCaught;
        axios.get('https://pokeapi.co/api/v2/pokemon/?limit=893')
            .then(result => { return result.data.results; })
            .then(pokemon =>
            {
                alreadyCaught = this.getAlreadyCaught();

                pokemon = pokemon.map(rd => ({ 'caught': alreadyCaught.includes(rd.name), 'name': this.Capitalize(rd.name), 'hiddenName' : rd.name }));
                this.setState({ pokemonNames: pokemon });

                this.updateRender(pokemon);
            });

    }

    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    setChecked(pokemonName) {
        var alreadyCaught = this.updateAlreadyCaught(pokemonName.toLowerCase());

        var pokemon = this.state.pokemonNames.map(rd => ({ 'caught': alreadyCaught.includes(rd.name.toLowerCase()), 'name': this.Capitalize(rd.name), 'hiddenName': rd.name }));
        this.setState({ pokemonNames: pokemon });

        this.updateRender(pokemon);
    }

    updateRender(pokemon){
        pokemon = pokemon.map(rd => ({
            'caught': <input type='checkbox' checked={rd.caught ? `checked` : ''} onChange={(e) => { this.setChecked(e.currentTarget.id.toLowerCase()); }} id={rd.name} />,
            'name': <Link to={`/dexlist/${rd.name.toLowerCase()}`}> {this.Capitalize(rd.name)}</Link>,
            'hiddenName': rd.hiddenName 
        }));
        var temp = { ...this.state.renderedPokemon };
        temp.rows = pokemon;
        this.setState({ renderedPokemon: temp });
    }

    updateAlreadyCaught(pokemonName){
        var alreadyCaught = this.getAlreadyCaught();

        if (alreadyCaught.includes(pokemonName.toLowerCase())) {
            const index = alreadyCaught.indexOf(pokemonName.toLowerCase());
            if (index > -1) {
                alreadyCaught.splice(index, 1);
            }
        } else {
            alreadyCaught = alreadyCaught.concat(pokemonName.toLowerCase());
        }
        localStorage.setItem('pokemonCaught', alreadyCaught);

        return alreadyCaught;
    }

    getAlreadyCaught() {
        let alreadyCaught;
        var pokemonCaught = localStorage.getItem('pokemonCaught');
        if (pokemonCaught !== null) {
            alreadyCaught = pokemonCaught.toLowerCase().split(",");
        } else {
            alreadyCaught = [];
        }
        return alreadyCaught;
    }
    
    render(){
        return (
            <div>
                <div className="center-table-sm">
                    <MDBDataTable striped bordered hover paging={false} searching={true} data={this.state.renderedPokemon}/>
                </div>
            </div>
        );
    }
}

export default DexList;