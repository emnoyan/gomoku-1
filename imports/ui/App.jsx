import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks.js';
import { Selections } from '../api/selections.js';
import Task from './Task.jsx';
 
// App component - represents the whole app

const BOARD_SIZE = 15
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
    Selections.insert({
      type: 'circle',
      row,
      col
    });
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
          <div className={"boardCell" + (this.props.board[row][col] === 'circle'? ' boardCellCircle' : '')} id={row + "-" + col} key={row + "-" + col} onClick={() => this.handleCellClick(row, col)}>

          </div>
        </div>
        ))}
      </div>));
  }
 
  render() {
    return (
      <div className="container">
        <div className="controls">
          <button className="btn">
              New
          </button>
          <div className="messages">
            <div className="messagesContainer">
              <div className="newMainText" id="message">try to get 5 in a row!</div>
            </div>
          </div>
        </div>
        <div className="board">
            {this.renderBoard()}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  board: PropTypes.array.isRequired,
};

export default createContainer(() => {
  let board = new Array(15)
  for(let i=0; i< 15; i++) {
    board[i] = new Array(15)
  }
  const selection = Selections.find({ type : 'circle'}).fetch()
  board = selection.reduce((pre, item) => {
    pre[item.row][item.col] = 'circle'
    return pre
  }, board)

  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    board
  }
}, App)