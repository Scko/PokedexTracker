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
                {headerName: 'ID', field: 'id'},
                {headerName: 'Name', field: 'name'},
                {headerName: 'Number', field: 'number'}

            ],
            rowData: []
        }
    }

    componentDidMount() {
        //fetch('/pokemon')
        //    .then(result => {return result.json()})
        //    .then(rowData => this.setState({rowData}))
        
        axios.get('/pokemon')
            .then(result => {return result.data;})
            .then(pokemon => {this.setState({rowData : pokemon});})
    }


    render(){
        return (
            <div className="ag-theme-balham" style={{ height: '200px', width: '600px' }}>
                <AgGridReact
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