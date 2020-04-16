import React from "react";
import './DexList.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

class DexList extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            columnDefs: [
                { headerName: 'Sprite', field: 'sprites.front_default', cellRenderer: this.spriteCellRenderer },//autoHeight:true
                { headerName: 'Name', field: 'name' },
                { headerName: 'Number', field: 'id' }
            ],
            pokemonData: [],
            itemData: [],
            p: [],
            displayMenu: true,
            displayDexList: false,
            displayItems: false,
            displayPokemon: false,
            pokemon: {},
            displayItem: false,
            item: {}
        };
    }

    componentDidMount() {
        axios.get('https://pokeapi.co/api/v2/pokemon/?limit=807')
            .then(result => { return result.data.results; })
            .then(
                pokemon => {
                    const p = Promise.all(pokemon.map( x => axios.get(`https://pokeapi.co/api/v2/pokemon/${x.name}`)));
                    return p;
                })
            .then(
                po => {
                    let p = [];
                    po.forEach((v, i) => { p.push(v.data); });
                    this.setState({ pokemonData: p });
                }
        );

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

    spriteCellRenderer(params) {
        if (params.value) {
            const flag = "<img src=" + params.value + " />";
            return flag;
        } else {
            return null;
        }
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

    render(){
        return (
            <div>
                {
                    this.state.displayMenu &&
                    <Container>
                    <Row><button onClick={() => { this.setState({ displayMenu: false }); this.setState({ displayDexList: true }); }}>Dex List</button></Row>
                    <Row><button onClick={() => { this.setState({ displayMenu: false }); this.setState({ displayItems: true }); }}>Items</button></Row>
                    </Container>
                }
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
        );
    }

}

export default DexList;