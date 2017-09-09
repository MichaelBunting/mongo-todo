import React from 'react';
import axios from 'axios';

class TodoContainer extends React.Component {
    constructor() {
        super();

        this.state = {
            tasks: []
        }
    }

    componentDidMount() {
        axios.get('/tasks/all')
            .then(data => {
                this.setState({
                    tasks: data.data
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    render() {
        return (
            <div>
                {this.state.tasks.length ?
                    <div>
                        <div>We got tasks, baby!</div>

                        <ul>
                            {this.state.tasks.map((task, i) => {
                                return (
                                    <li key={i}>
                                        Name: {task.name} <br />
                                        Time: {task.time}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                : 
                    <div>Sorry, No tasks</div>
                }
            </div>
        )
    }
}

export default TodoContainer;