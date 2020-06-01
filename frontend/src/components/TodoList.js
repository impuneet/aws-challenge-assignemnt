import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'bootstrap/dist/css/bootstrap.min.css';
import API from '../api/api';

class TodoList extends Component {
    constructor(props) {
        super(props);
    }


    updateStatus(item,i){
        if(item){
            item.status = this.nextState(item.status);
            API.update(item.id,item).then(response => {
                this.props.items[i] = response.data;
                this.refersh();
            }).catch(err=> {
                console.log(err);
            })
        }
    }

    deleteList(item,i){
        if(item){
            console.log(item,i);
            API.delete(item.id,item).then(response => {

                console.log(response);
                this.refersh();
            }).catch(err => {
                console.log(err);
            })
        }
    }

    refersh = () => {
        API.getAll().then(response => {
            this.props.onItemChange(response.data);
           /*  React.renderComponent(
                TodoList({items : response.data})
            ); */
        }).catch(err => {
            console.log(err);
        })
    }

    componentWillReceiveProps({someProp}) {
        console.log(someProp);
        this.setState({...this.state,someProp})
    }

    nextState(state){
        switch(state){
            case 'OPEN' :
                return 'IN_PROGRESS';
            case 'IN_PROGRESS' :
                return 'DONE'
            default :
                return 'DONE'
        }
    }

    render() {
        //console.log(this.props);
        const styles = {
            pointerClass : {
                cursor:"pointer"
            }
        }
        return (
            <div className="row">
                <div className="col-md-12">
                    <table className="table table-condensed extended column-heading">
                        <thead>
                            <tr>
                                <th width="25%">ID</th>
                                <th width="25%">Text</th>
                                <th width="25%">State</th>
                                <th width="25%">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.items.map((item,index) =>(
                                <tr  className={item.status === 'OPEN' ? "table-danger" : "table-success" }>
                                    <td>{item.id}</td>
                                    <td>{item.title}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        <button onClick={() => this.updateStatus(item,index)}  className="btn btn-primary" value="Action" >Action</button>
                                        <button onClick={() => this.deleteList(item,index)} className="btn btn-danger" value="Delete" >Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default TodoList;
