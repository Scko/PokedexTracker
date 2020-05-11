import React from "react";
import './DexList.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import './TopBanner.css';
import logo from './logo.svg';


class DexList extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            columnDefs: [
                {
                    headerName: 'Caught', field: 'caught', cellRenderer: params => {
                        return `<input type='checkbox' ${params.value.caught ? 'checked' : ''} id='${params.value.name}'/>`;
                    }
                },
                { headerName: 'Name', field: 'name' },
               
            ],
            pokemonData: [],
            pokemonNameData: [],
            itemData: [],
            p: [],
            pokemonNames: [],
            displayMenu: false,
            displayDexList: false,
            displayItems: false,
            displayPokemon: false,
            pokemon: {},
            displayItem: false,
            item: {},
            displayTracker: false,
            width: 0,
            height: 0,
            pokemonAlreadyCaught: []
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
                alreadyCaught = localStorage.getItem('pokemonCaught').split(",");
                pokemon = pokemon.map(rd => ({ 'caught': { 'caught': alreadyCaught.includes(rd.name), 'name': rd.name }, 'name': rd.name }));
                this.setState({ pokemonNameData: pokemon });
            });
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
        axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .then(result => { return result.data; })
            .then(
                po => {
                    this.setState({ pokemon: po });
                    this.setState({ displayDexList: false });
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

    display(tracker=false, dexlist=false, items=false){
        this.setState({ displayTracker: tracker });
        this.setState({ displayDexList: dexlist });
        this.setState({ displayItems: items });
    }

    updateTracker = e => {
        var saveData = [...document.querySelectorAll('input:checked')].map(c => c.id).join(',');
        localStorage.setItem('pokemonCaught', saveData );
    }

    render(){
        return (
            <div>
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title" onClick={() => { this.display(); }}>Pokedex Tracker</h1>

                    <h2 onClick={() => { this.getPokemonNames(); this.display(true); }}>Tracker</h2>
                    <h2 onClick={() => { this.getAllPokemon(); this.display(false, true); }}>DexList</h2>
                    <h2 onClick={() => { this.getAllItems(); this.display(false, false, true);}}>ItemList</h2>
                </header>
            <div>
                {
                    this.state.displayDexList &&
                    <Container>
                        {this.state.pokemonData.map(pokemon =>
                            <button id={pokemon.name} onClick={(e) =>
                            {
                                this.getPokemon(e.currentTarget.id);
                            }}>

                            <Card>
                                <Card.Img variant="top" src={pokemon.sprites.front_default} />
                                <Card.Body>
                                    <Card.Text>
                                        {pokemon.name}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            </button>
                        )}
                    </Container>
                }
                {
                    this.state.displayTracker && 
                    <div className="ag-theme-balham" style={{ height: this.state.height, width: this.state.width }}>
                        <button onClick={this.updateTracker}>Update Tracker!</button>
                        <AgGridReact 
                            rowSelection="multiple"
                            onGridReady={params => this.gridApi = params.api}
                            enableSorting={true}
                            enableFilter={true}
                            pagination={true}
                            columnDefs={this.state.columnDefs}
                            rowData={this.state.pokemonNameData}>
                        </AgGridReact>
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
                    <Container>
                        {
                            <Card>
                                <Card.Img variant="top" src={this.state.pokemon.sprites.front_default} />
                                <Card.Body>
                                    <Card.Text>
                                        {this.state.pokemon.name}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        }
                    </Container>
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