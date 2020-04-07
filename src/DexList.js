import React from "react";
import './DexList.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import axios from 'axios';

class DexList extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            columnDefs: [
                { headerName: 'Sprite', field: 'sprites.front_default', cellRenderer: this.spriteCellRenderer },//autoHeight:true
                { headerName: 'Name', field: 'name' },
                { headerName: 'Number', field: 'id' }
            ],
            rowData: [],
            p: []
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
                    this.setState({ rowData: p });
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

    render(){
        return (
            <div className="ag-theme-balham" style={{ height: '500px', width: '600px' }}>
                <AgGridReact
                    rowHeight={125}
                    enableSorting={true}
                    enableFilter={true}
                    pagination={true}
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}>
                </AgGridReact>
            </div>
        );
    }

}

export default DexList;