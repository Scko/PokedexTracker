import React from "react";
import './DexList.css';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';
import logo from './pokeball.svg';
import { MDBDataTable } from 'mdbreact';
import Pokemon from './Pokemon';
class DexList extends React.Component{

    constructor(props) {
        super(props); 

        this.state = {
            pokemon: {},
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

                pokemon = pokemon.map(rd => ({ 'caught': alreadyCaught.includes(rd.name), 'name': rd.name, 'hiddenName' : rd.name }));
                this.setState({ pokemonNames: pokemon });

                this.updateRender(pokemon);
            });

    }

    setChecked(pokemonName) {
        var alreadyCaught = this.updateAlreadyCaught(pokemonName);

        var pokemon = this.state.pokemonNames.map(rd => ({ 'caught': alreadyCaught.includes(rd.name), 'name': rd.name, 'hiddenName': rd.name }));
        this.setState({ pokemonNames: pokemon });

        this.updateRender(pokemon);
    }

    updateRender(pokemon){
        pokemon = pokemon.map(rd => ({
            'caught': <input type='checkbox' checked={rd.caught ? `checked` : ''} onChange={(e) => { this.setChecked(e.currentTarget.id); }} id={rd.name} />,
            'name': <button className="fill" id={rd.name} onClick={(e) => { this.getPokemon(e.currentTarget.id); }}> {rd.name} </button>,
            'hiddenName': rd.hiddenName 
        }));
        var temp = { ...this.state.renderedPokemon };
        temp.rows = pokemon;
        this.setState({ renderedPokemon: temp });
    }

    updateAlreadyCaught(pokemonName){
        var alreadyCaught = this.getAlreadyCaught();

        if (alreadyCaught.includes(pokemonName)) {
            const index = alreadyCaught.indexOf(pokemonName);
            if (index > -1) {
                alreadyCaught.splice(index, 1);
            }
        } else {
            alreadyCaught = alreadyCaught.concat(pokemonName);
        }
        localStorage.setItem('pokemonCaught', alreadyCaught);

        return alreadyCaught;
    }

    getAlreadyCaught() {
        let alreadyCaught;
        var pokemonCaught = localStorage.getItem('pokemonCaught');
        if (pokemonCaught !== null) {
            alreadyCaught = pokemonCaught.split(",");
        } else {
            alreadyCaught = [];
        }
        return alreadyCaught;
    }

    getPokemon(name) {
        axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .then(result => { return result.data; })
            .then(
                po => {
                    var moves = po.moves.map(move => ({ 'name': move.move.name, 'versions': move.version_group_details }));
                    let flatMoves = [];
                    moves.forEach((m, i) => {
                        m.versions.forEach((v, i) => {
                            flatMoves.push({ 'name': m.name, 'level': v.level_learned_at, 'method': v.move_learn_method.name, 'version': v.version_group.name });
                        });
                    });
                    var temp = { ...this.state.renderedMoves };
                    temp.rows = flatMoves;
                    this.setState({ renderedMoves: temp });
                    this.setState({ pokemon: po });
                    this.setState({ displayTracker: false });
                    this.setState({ displayPokemon: true });
                }
            );
    }
    
    render(){
        return (
            <div>

                    <div>
                    <header className="App-header" style={{ display: `flow-root` }}>
                        <img src={logo} className="App-logo" alt="logo" />
                        <h2 className="App-title" onClick={() => { this.getPokemonNames(); this.setState({ displayTracker: true }); this.setState({ displayPokemon: false }); }}>PokedexTracker</h2>
                        </header>
                    </div>
                    {
                        this.state.displayTracker &&
                        <div className="center-table-sm">
                            <MDBDataTable striped bordered hover paging={false} searching={true} data={this.state.renderedPokemon}/>
                        </div>
                    }
                {
                    this.state.displayPokemon &&
                    <Pokemon pokemon={this.state.pokemon} renderedMoves={this.state.renderedMoves} />
                }
            </div>
        );
    }
}

export default DexList;