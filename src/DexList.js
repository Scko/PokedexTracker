import React from "react";
import './DexList.css';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import logo from './pokeball.svg';
import { MDBDataTable } from 'mdbreact';

class DexList extends React.Component{


    constructor(props) {
        super(props); 

        this.state = {
            pokemonNameData: [],
            renderedPokemon : {
                columns: [
                    {
                        label: 'Caught',
                        field: 'caught'
                    },
                    {
                        label: 'Name',
                        field: 'name'
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
            columnDefsMoves: [
                { headerName: 'Name', field: 'name' },
                { headerName: 'Level', field: 'level' },
                { headerName: 'Method', field: 'method' },
                { headerName: 'Version', field: 'version' }
            ],
            moveData: [],
            rbMoves: [],
            yMoves: [],
            gsMoves: [],
            cMoves: [],
            orasMoves: [],
            b2w2Moves: [],
            bwMoves: [],
            hgssMoves: [],
            pMoves: [],
            dpMoves: [],
            usumMoves: [],
            smMoves: [],
            eMoves: [],
            xyMoves: [],
            pokemonData: [],
            itemData: [],
            displayItems: false,
            displayPokemon: false,
            pokemon: {},
            displayItem: false,
            item: {},
            displayTracker: false,
            width: 0,
            height: 0,
        };

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        
    }

    
    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    getPokemonNames()
    {
        let alreadyCaught;
        axios.get('https://pokeapi.co/api/v2/pokemon/?limit=802')
            .then(result => { return result.data.results; })
            .then(pokemon =>
            {
                alreadyCaught = this.getAlreadyCaught();

                pokemon = pokemon.map(rd => ({ 'caught': alreadyCaught.includes(rd.name), 'name': rd.name }));
                this.setState({ pokemonNameData: pokemon });

                this.updateRender(pokemon);
            });

    }
    setChecked(pokemonName) {
        var alreadyCaught = this.updateAlreadyCaught(pokemonName);

        var pokemon = this.state.pokemonNameData.map(rd => ({ 'caught':alreadyCaught.includes(rd.name), 'name': rd.name }));
        this.setState({ pokemonNameData: pokemon });

        this.updateRender(pokemon);
    }

    updateRender(pokemon)
    {
        pokemon = pokemon.map(rd => ({
            'caught': <input type='checkbox' checked={rd.caught ? `checked` : ''} onChange={(e) => { this.setChecked(e.currentTarget.id); }} id={rd.name} />,
            'name': <button id={rd.name} onClick={(e) => { this.getPokemon(e.currentTarget.id); }}> {rd.name}</button>
        }));
        var temp = { ...this.state.renderedPokemon };
        temp.rows = pokemon;
        this.setState({ renderedPokemon: temp });
    }

    updateAlreadyCaught(pokemonName)
    {
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

    getAllPokemon()
    {
        axios.get('https://pokeapi.co/api/v2/pokemon/?limit=802')
            .then(result => { return result.data.results; })
            .then(
                pokemon => {
                    const p = Promise.all(pokemon.map(x => axios.get(`https://pokeapi.co/api/v2/pokemon/${x.name}`)));
                    return p;
                })
            .then(
                po => {
                    let p = [];
                    po.forEach((v, i) => { p.push(v.data); });
                    this.setState({ pokemonData: p });
                }
            );
    }

    getPokemon(name)
    {
        //rbMoves: [],
        //    yMoves: [],
        //        gsMoves: [],
        //            cMoves: [],
        //                orasMoves: [],
        //                    b2w2Moves: [],
        //                        bwMoves: [],
        //                            hgssMoves: [],
        //                                pMoves: [],
        //                                    dpMoves: [],
        //                                        usumMoves: [],
        //                                            smMoves: [],
        //                                                eMoves: [],
        //                                                    xyMoves: [],
        axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .then(result => { return result.data; })
            .then(
                po => {
                    var moves = po.moves.map(move => ({ 'name': move.move.name, 'versions': move.version_group_details }));
                    let flatMoves = [];
                    moves.forEach((m, i) =>
                    {
                        m.versions.forEach((v, i) => {
                            flatMoves.push({ 'name': m.name, 'level':v.level_learned_at, 'method':v.move_learn_method.name , 'version':v.version_group.name });
                        });
                    });
                   flatMoves.filter(m =>  m.version === 'firered-leafgreen');
                    this.setState({ moveData: flatMoves });
                    var temp = { ...this.state.renderedMoves };
                    temp.rows = flatMoves;
                    this.setState({ renderedMoves: temp });
                    this.setState({ pokemon: po });
                    this.setState({ displayTracker: false });
                    this.setState({ displayPokemon: true });
                }
            );
    }

    getAllItems()
    {
        axios.get('https://pokeapi.co/api/v2/item/?limit=954')
            .then(result => { return result.data.results; })
            .then(
                items => {
                    const p = Promise.all(items.map(x => axios.get(`https://pokeapi.co/api/v2/item/${x.name}`)));
                    return p;
                })
            .then(
                po => {
                    let p = [];
                    po.forEach((v, i) => { p.push(v.data); });
                    this.setState({ itemData: p });
                }
            );
    }

    getItem(name) {
        axios.get(`https://pokeapi.co/api/v2/item/${name}`)
            .then(result => { return result.data; })
            .then(
                i => {
                    this.setState({ item: i });
                    this.setState({ displayItems: false });
                    this.setState({ displayItem: true });
                }
            );
    }

    display(tracker=false, items=false){
        this.setState({ displayTracker: tracker });
        this.setState({ displayItems: items });
        this.setState({ displayPokemon: false });
        this.setState({ displayItems: false });
    }
    
    render(){
        return (
            <div>
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title" onClick={() => { this.display(); }}>Pokedex Tracker   </h1>
                    <h2 className="App-title"  onClick={() => { this.getPokemonNames(); this.display(true); }}>Tracker </h2>
                    <h2 className="App-title"  onClick={() => { this.getAllItems(); this.display(false, false, true);}}>ItemList</h2>
                </header>
            <div>
                {
                    this.state.displayTracker && 
                    <div>
                        <MDBDataTable striped bordered hover paging={false} searching={false} data={this.state.renderedPokemon} />
                    </div>
                }
                {
                    this.state.displayItems &&
                    <Container>
                        {this.state.itemData.map(item =>
                            <button id={item.name} onClick={(e) => {
                                this.getItem(e.currentTarget.id);
                            }}>
                            <Card>
                                <Card.Img variant="top" src={item.sprites.default} />
                                <Card.Body>
                                    <Card.Text>
                                        {item.name}
                                    </Card.Text>
                                </Card.Body>
                                </Card>
                                </button>
                        )}
                    </Container>
                }
                    {
                        this.state.displayPokemon &&
                        <div >
                            <h1>{this.state.pokemon.name}</h1>
                            <img src={this.state.pokemon.sprites.front_default} alt="default sprite" width="10%"/>
                            <img src={this.state.pokemon.sprites.front_shiny} alt="shiny sprite" width="10%"/>
                            <table >
                                <tbody>
                                    <tr><th colSpan="2">Types</th></tr>
                                    <tr>{this.state.pokemon.types.map(type => <td>{type.type.name}</td>)}</tr>
                                </tbody>
                            </table>

                            <table  >
                                <tbody>
                                    <tr><th colSpan="2">Abilities</th></tr>
                                    <tr>{this.state.pokemon.abilities.map(ability => <td>{ability.ability.name}</td>)}</tr>
                                </tbody>
                            </table>
                            
                            <table  >
                                <tbody>
                                    <tr><th colSpan="6">Stats</th></tr>
                                    <tr>{this.state.pokemon.stats.map(stat => <th>{stat.stat.name}</th>)}</tr>
                                    <tr>{this.state.pokemon.stats.map(stat => <td>{stat.base_stat}</td>)}</tr>
                                </tbody>
                            </table>
                                       
                            <MDBDataTable striped bordered hover data={this.state.renderedMoves} />
                        </div>
                       
                }
                {
                    this.state.displayItem &&
                    <Container>
                        {
                            <Card>
                                <Card.Img variant="top" src={this.state.item.sprites.default} />
                                <Card.Body>
                                    <Card.Text>
                                        {this.state.item.name}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        }
                    </Container>
                }
                </div>
                </div>
        );
    }

}

export default DexList;