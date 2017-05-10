import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks.js';
import { Selections } from '../api/selections.js';
import Task from './Task.jsx';
 
// App component - represents the whole app
class App extends Component {
 
  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
 
    Tasks.insert({
      text,
      createdAt: new Date(), // current time
    });
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  handleCellClick(row, col) {

  }

  renderTasks() {
    return this.props.tasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }
  renderBoard() {

    return [...Array(15).keys()].map(row => (
      <div className="boardRow">
      {[...Array(15).keys()].map(col => (
        <div className="boardCol">
          <div className="boardCell" id={row + "-" + col} onClick={() => this.handleCellClick(row, col)}>
          </div>
        </div>
        ))}
      </div>));
  }
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List</h1>
          <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add new tasks"
            />
            <button type="submit" value="Add">Add</button>
          </form>
        </header>
 
        <ul>
          {this.renderTasks()}
        </ul>
        <div className="board">
        {this.renderBoard()}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    circle : Selections.find({ type : 'circle'}).map(item => a[item.x][item.y]).fetch()
  };
}, App);