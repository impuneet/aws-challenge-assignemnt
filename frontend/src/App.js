import React, { Component } from 'react';
import TodoList from './components/TodoList';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import API from './api/api';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            noteText: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({ noteText: e.target.value })
    }

    componentDidMount() {
        this.getAllList();
    }

    getAllList(){
        API.getAll().then(response => {
            this.setState({
                items : response.data,
                noteText: ''
            });
            console.log(response.data);
        }).catch(err => {
            console.log(err);
        })
    }

     refreshData(){
         API.getAll().then(response => {
            this.setState({
                items : response.data
            });
            console.log(response.data);
        }).catch(err => {
            console.log(err);
        })
    }


    onChange = (newName) => {
        console.log(newName);
        this.setState({ items: newName });
    }


    handleSubmit(e) {
        e.preventDefault(); 
        console.log(this.state.noteText.length);
        if (!this.state.noteText.length) {
            return;
        }

        const newItem = {
            title: this.state.noteText,
            status: 'OPEN'
        };

        API.create(newItem).then(async response => {
            if(response){
               await this.getAllList();
            }
        }).catch(err => {
            console.log(err);
        })
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <form className="form-inline">
                            <input
                                ref={((input) => {this.textInput = input})}
                                className="form-control"
                                value={this.state.noteText}
                                onChange={this.handleChange}
                                name="text" 
                                placeholder="New Task..." />
                            <a className="btn btn-primary" onClick={this.handleSubmit} >Save</a>
                        </form>
                    </div>
                    <div className="col-md-4"></div>
                    <div className="col-md-4"></div>
                </div>
                <TodoList  onItemChange={this.onChange}   items={this.state.items} ></TodoList>
            </div>
        );
    }
}


export default App;
