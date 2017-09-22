import React from 'react';
import axios from 'axios';

import List from '../components/List';

class TodoContainer extends React.Component {
    constructor() {
        super();

        this.state = {
            loading: true,
            tasks: []
        }

        this.completeTask = this.completeTask.bind(this);
        this.addNewTask = this.addNewTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
    }

    componentDidMount() {
        axios.get('/tasks/all')
            .then(data => {
                this.setState({
                    tasks: data.data,
                    loading: false
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    completeTask(e) {
        let id = e.currentTarget.parentNode.dataset.id;
        let taskIndex = this.state.tasks.findIndex(task => {
            return task._id === id;
        });
        let taskObj = this.state.tasks[taskIndex];
        let completeToggle = taskObj.complete ? false : true;

        axios.put(`/tasks/toggleComplete/${id}&${completeToggle}`)
            .then(data => {
                let tasksCopy = this.state.tasks;

                tasksCopy[taskIndex].complete = data.data.complete;

                tasksCopy.sort(task => {
                    return task.complete ? -1 : 1;
                });

                this.setState({
                    tasks: tasksCopy
                });
            })
            .catch(err => {
                console.error(err);
            });

        // let check = e.currentTarget;
        // let task = check.parentNode;

        // task.classList.toggle('complete');
    }

    toggleTodoAdd(e) {
        let target = e.currentTarget.dataset.target;
        
        document.querySelector(target).classList.toggle('open');
        document.querySelector('.todo__add-btn').classList.toggle('out');
        
        if (document.querySelector(target).classList.contains('open')) {
            setTimeout(() => {
                document.querySelector(target).querySelector('input[name="taskName"]').focus();
            }, 300);
        }
    }

    addNewTask(e) {
        e.preventDefault();

        let formData = new FormData(e.nativeEvent.target);
        let taskNameInput = e.nativeEvent.target.querySelector('input[name="taskName"]');
        let postData = {};

        for (let formValues of formData.entries()) {
            postData[formValues[0]] = formValues[1];
        }

        axios.post('/tasks/add', postData)
            .then(data => {
                taskNameInput.value = '';
                
                let currentTasks = this.state.tasks;
        
                currentTasks.push(data.data.newTask);
        
                this.setState({
                    tasks: currentTasks
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    deleteTask(e) {
        let id = e.currentTarget.parentNode.dataset.id;

        axios.delete('/tasks/delete/' + id)
            .then(data => {
                let currentTasks = this.state.tasks;
                let taskToDelete = currentTasks.findIndex(task => task._id === data.data.taskId);

                currentTasks.splice(taskToDelete, 1);

                this.setState({
                    tasks: currentTasks
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    render() {
        let date = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).replace(/\,/g, '').split(' ');

        let timeDateObj = new Date();
        let hours = timeDateObj.getHours();
        let minutes = ('0' + timeDateObj.getMinutes()).slice(-2);

        let time = `${hours}:${minutes}`;

        return (
            <div className="todo">
                {this.state.loading ? 
                    <div className="todo__loading">
                        Loading...
                    </div>
                : 
                    <div>
                        <div className="todo__inner">
                            <div className="todo__header todo__section">
                                <div className="todo__header-date todo__header-block clearfix">
                                    <div className="todo__header-day">{date[2]}</div>
                                    <div className="todo__header-month">{date[1]}</div>
                                    <div className="todo__header-year">{date[3]}</div>
                                </div>
                                <div className="todo__header-weekday todo__header-block">
                                    {date[0]}
                                </div>
                            </div>
                            <div className="todo__section todo__body">
                                {this.state.tasks.length > 0 ?
                                    <List list={this.state.tasks}
                                        completeTask={this.completeTask}
                                        deleteTask={this.deleteTask} />
                                :
                                    <span>Sorry, No tasks</span>
                                }
                            </div>

                            <div className="todo__add" id="todoAdd">
                                <div className="todo__add-close" onClick={this.toggleTodoAdd} data-target="#todoAdd">&#x2715;</div>
                                <div className="todo__add-title">Add new todo</div>

                                <form method="post" className="todo__add-form" onSubmit={this.addNewTask} name="addTodo">
                                    <input type="text" className="todo__add-input" placeholder="Task Name" autoComplete="off" name="taskName" />
                                    <input type="time" className="todo__add-input" defaultValue={time} name="taskTime" />
                                    <button className="todo__add-submit" onClick={this.toggleTodoAdd} data-target="#todoAdd">Add Todo</button>
                                </form>
                            </div>
                        </div>

                        <div className="todo__add-btn" onClick={this.toggleTodoAdd} data-target="#todoAdd">
                            <span className="todo__add-btn-icon">&#43;</span>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default TodoContainer;