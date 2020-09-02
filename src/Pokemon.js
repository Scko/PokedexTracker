import React from "react";
import './Pokemon.css';
import 'react-tabs/style/react-tabs.css';
import { MDBDataTable } from 'mdbreact';
import axios from 'axios';

class Pokemon extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            pokemon: {
                types: [],
                abilities: [],
                stats: [],
                sprites: {
                    other: {
                        // eslint-disable-next-line
                        ["official-artwork"]: 
                        {
                                front_default:""
                            }
                    }
                }
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
            moves: [],
            methodFilter: "level-up",
            versionFilter: "ultra-sun-ultra-moon",
            bgColor:"white"
        };

        this.getPokemon = this.getPokemon.bind(this);
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        this.getPokemon(params.pokemonName.toLowerCase());

        
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
                            flatMoves.push({ 'name': this.Capitalize(m.name), 'level': v.level_learned_at, 'method': v.move_learn_method.name, 'version': v.version_group.name });
                        });
                    });
                    var temp = { ...this.state.renderedMoves };
                    this.setState({ moves: flatMoves });
                    temp.rows = flatMoves;
                    this.setState({ renderedMoves: temp });
                    po.name = this.Capitalize(po.name);
                    this.setState({ pokemon: po });
                    this.versionFilter("ultra-sun-ultra-moon");
                    this.methodFilter("level-up");
                    this.setState({ bgColor: this.typeToColor(po.types[0].type.name) });
                }
        );
    }

    typeToColor(type)
    {
        let color;
        switch (type) {
            case "grass":
                color = "#2FCF27";
                break;
            case "fire":
                color = "#E26532";
                break;
            case "water":
                color = "#326DE2";
                break;
            case "poison":
                color = "#8317D8";
                break;
            case "flying":
                color = "#D3FDFC";
                break;
            case "electric":
                color = "#E3EE5A";
                break;
            case "fighting":
                color = "#C0840D";
                break;
            case "psychic":
                color = "#BF1BE3";
                break;
            case "ghost":
                color = "#B28DBA";
                break;
            case "steel":
                color = "#8C8C89";
                break;
            case "dark":
                color = "#4D4D4D";
                break;
            case "normal":
                color = "#F8F8F8";
                break;
            case "bug":
                color = "#2FCF27";
                break;
            case "ground":
                color = "#8E8665";
                break;
            case "rock":
                color = "#AA9855";
                break;
            case "fairy":
                color = "#F982CC";
                break;
            case "ice":
                color = "#3DE5E1";
                break;
            case "dragon":
                color = "#47487B";
                break;
            default:
                color = "white";
                break;
        }
        return color;
    }

    methodFilter(filterBy) {
        let flatMoves = this.state.moves;
        var temp = { ...this.state.renderedMoves };
        temp.rows = flatMoves.filter(m => m.method === filterBy && m.version === this.state.versionFilter);
        this.setState({ renderedMoves: temp });
        this.setState({ methodFilter: filterBy });
    }

    versionFilter(filterBy) {
        let flatMoves = this.state.moves;
        var temp = { ...this.state.renderedMoves };
        temp.rows = flatMoves.filter(m => m.version === filterBy && m.method === this.state.methodFilter);
        this.setState({ renderedMoves: temp });
        this.setState({ versionFilter: filterBy });
    }

    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    render() {
        return (
            <div >
                <div  >
                    <h1>{this.state.pokemon.name}</h1>
                    <img src={this.state.pokemon.sprites.other['official-artwork'].front_default} alt="official art" />
                    <img src={this.state.pokemon.sprites.front_default} alt="default sprite" width="10%" />
                    <img src={this.state.pokemon.sprites.front_shiny} alt="shiny sprite" width="10%" />

                    <h2>Types</h2>
                    <table className="center-table">
                        <tbody>
                            <tr>{this.state.pokemon.types.map(type => <td><button style={{ backgroundColor: this.typeToColor(type.type.name) }} onClick={() => { }}>{type.type.name}</button></td>)}</tr>
                        </tbody>
                    </table>


                    <h2>Abilities</h2>
                    <table className="center-table">
                        <tbody>
                            <tr>{this.state.pokemon.abilities.map(ability => <td><button style={{ backgroundColor: this.state.bgColor }} onClick={() => { }}>{ability.ability.name}</button></td>)}</tr>
                        </tbody>
                    </table>

                    <h2>Stats</h2>
                    <table className="center-table">
                        <tbody>
                            <tr>{this.state.pokemon.stats.map(stat => <th>{stat.stat.name}</th>)}</tr>
                            <tr>{this.state.pokemon.stats.map(stat => <td>{stat.base_stat}</td>)}</tr>
                        </tbody>
                    </table>

                    <h2>Moves</h2>
                    <button style={{ backgroundColor: this.state.bgColor }} onClick={() => { this.methodFilter("level-up"); }}>Level Up</button>
                    <button style={{ backgroundColor: this.state.bgColor }} onClick={() => { this.methodFilter("tutor"); }}>Tutor</button>
                    <button style={{ backgroundColor: this.state.bgColor }} onClick={() => { this.methodFilter("machine"); }}>Machine</button>
                    <button style={{ backgroundColor: this.state.bgColor }} onClick={() => { this.methodFilter("egg"); }}>Egg</button>
                    <MDBDataTable thead={this.state.bgColor} className="center-table" striped bordered hover data={this.state.renderedMoves} />
                    <button style={{ backgroundColor: this.state.bgColor }} onClick={() => { this.versionFilter("red-blue"); }}>RB</button>
                    <button style={{ backgroundColor: this.state.bgColor }} onClick={() => { this.versionFilter("yellow"); }}>Y</button>
                    <button style={{ backgroundColor: this.state.bgColor }} onClick={() => { this.versionFilter("gold-silver"); }}>GS</button>
                    <button style={{ backgroundColor: this.state.bgColor }} onClick={() => { this.versionFilter("crystal"); }}>C</button>
                    <button style={{ backgroundColor: this.state.bgColor }} onClick={() => { this.versionFilter("ruby-sapphire"); }}>RS</button>
                    <button style={{ backgroundColor: this.state.bgColor }} onClick={() => { this.versionFilter("emerald"); }}>E</button>
                    <button style={{ backgroundColor: this.state.bgColor }} onClick={() => { this.versionFilter("firered-leafgreen"); }}>FRLG</button>
                    <button style={{ backgroundColor: this.state.bgColor }} onClick={() => { this.versionFilter("diamond-pearl"); }}>DP</button>
                    <button style={{ backgroundColor: this.state.bgColor }} onClick={() => { this.versionFilter("platinum"); }}>P</button>
                    <button style={{ backgroundColor: this.state.bgColor }} onClick={() => { this.versionFilter("heartgold-soulsilver"); }}>HGSS</button>
                    <button style={{ backgroundColor: this.state.bgColor }} onClick={() => { this.versionFilter("black-white"); }}>BW</button>
                    <button style={{ backgroundColor: this.state.bgColor }} onClick={() => { this.versionFilter("colosseum"); }}>Col</button>
                    <button style={{ backgroundColor: this.state.bgColor }} onClick={() => { this.versionFilter("xd"); }}>XD</button>
                    <button style={{ backgroundColor: this.state.bgColor }} onClick={() => { this.versionFilter("black-2-white-2"); }}>B2W2</button>
                    <button style={{ backgroundColor: this.state.bgColor }} onClick={() => { this.versionFilter("x-y"); }}>XY</button>
                    <button style={{ backgroundColor: this.state.bgColor }} onClick={() => { this.versionFilter("omega-ruby-alpha-sapphire"); }}>ORAS</button>
                    <button style={{ backgroundColor: this.state.bgColor }} onClick={() => { this.versionFilter("sun-moon"); }}>SM</button>
                    <button style={{ backgroundColor: this.state.bgColor }} onClick={() => { this.versionFilter("ultra-sun-ultra-moon"); }}>USUM</button>
                </div>
                </div>
        );
    }

}

export default Pokemon;