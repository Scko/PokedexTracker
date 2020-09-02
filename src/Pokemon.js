import React from "react";
import './DexList.css';
import 'react-tabs/style/react-tabs.css';
import { MDBDataTable } from 'mdbreact';

class Pokemon extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            pokemon: props.pokemon,
            renderedMoves: props.renderedMoves,
            moves: props.renderedMoves.rows,
            methodFilter: "level-up",
            versionFilter: "ultra-sun-ultra-moon"
        };
    } 

    componentDidMount() {
        this.versionFilter("ultra-sun-ultra-moon");
        this.methodFilter("level-up");
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

    render() {
        return (
            <div >
                <h1>{this.state.pokemon.name}</h1>
                <img src={this.state.pokemon.sprites.other['official-artwork'].front_default} alt="official art" />
                <img src={this.state.pokemon.sprites.front_default} alt="default sprite" width="10%" />
                <img src={this.state.pokemon.sprites.front_shiny} alt="shiny sprite" width="10%" />

                <h2>Types</h2>
                <table className="center-table">
                    <tbody>
                        <tr>{this.state.pokemon.types.map(type => <td>{type.type.name}</td>)}</tr>
                    </tbody>
                </table>


                <h2>Abilities</h2>
                <table className="center-table">
                    <tbody>
                        <tr>{this.state.pokemon.abilities.map(ability => <td>{ability.ability.name}</td>)}</tr>
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
                <button onClick={() => { this.methodFilter("level-up"); }}>Level Up</button>
                <button onClick={() => { this.methodFilter("tutor"); }}>Tutor</button>
                <button onClick={() => { this.methodFilter("machine"); }}>Machine</button>
                <button onClick={() => { this.methodFilter("egg"); }}>Egg</button>
                <MDBDataTable className="center-table" striped bordered hover data={this.state.renderedMoves} />
                <button onClick={() => { this.versionFilter("red-blue"); }}>RB</button>
                <button onClick={() => { this.versionFilter("yellow"); }}>Y</button>
                <button onClick={() => { this.versionFilter("gold-silver"); }}>GS</button>
                <button onClick={() => { this.versionFilter("crystal"); }}>C</button>
                <button onClick={() => { this.versionFilter("ruby-sapphire"); }}>RS</button>
                <button onClick={() => { this.versionFilter("emerald"); }}>E</button>
                <button onClick={() => { this.versionFilter("firered-leafgreen"); }}>FRLG</button>
                <button onClick={() => { this.versionFilter("diamond-pearl"); }}>DP</button>
                <button onClick={() => { this.versionFilter("platinum"); }}>P</button>
                <button onClick={() => { this.versionFilter("heartgold-soulsilver"); }}>HGSS</button>
                <button onClick={() => { this.versionFilter("black-white"); }}>BW</button>
                <button onClick={() => { this.versionFilter("colosseum"); }}>Col</button>
                <button onClick={() => { this.versionFilter("xd"); }}>XD</button>
                <button onClick={() => { this.versionFilter("black-2-white-2"); }}>B2W2</button>
                <button onClick={() => { this.versionFilter("x-y"); }}>XY</button>
                <button onClick={() => { this.versionFilter("omega-ruby-alpha-sapphire"); }}>ORAS</button>
                <button onClick={() => { this.versionFilter("sun-moon"); }}>SM</button>
                <button onClick={() => { this.versionFilter("ultra-sun-ultra-moon"); }}>USUM</button>
            </div>
        );
    }

}

export default Pokemon;