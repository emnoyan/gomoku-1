import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random'
import { createContainer } from 'meteor/react-meteor-data';
import { Selections } from '../api/selections.js';
import { Users } from '../api/users.js';
 
// App component - represents the whole app

const BOARD_SIZE = 15
class App extends Component {

  componentWillMount() {
    const { roomId } = this.props.match.params 
    const users = this.props.users.filter(item => item.roomId === roomId)
    console.log('users', users.length)
    let type = 'view'
    if(users.length == 0) {
      type = 'circle'
    } else if(users.length === 1) {
      type = 'cross'
    }

    const userId = Random.id()
    Users.insert({
      userId,
      type,
      roomId
    });
    this.setState({ userId })
  }

  componentWillUnmount() {
    Users.remove({ userId : this.state.userId })
  }

  handleCellClick(row, col) {
    Selections.insert({
      type: 'circle',
      row,
      col
    });
  }

  resetGame() {
    Meteor.call('selections.remove');
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
          <button className="button button1" onClick={() => this.resetGame()}>
              New
          </button>
          <div className="message">
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
  let board = new Array(BOARD_SIZE)
  for(let i=0; i< BOARD_SIZE; i++) {
    board[i] = new Array(BOARD_SIZE)
  }
  const selection = Selections.find({ type : 'circle'}).fetch()
  board = selection.reduce((pre, item) => {
    pre[item.row][item.col] = 'circle'
    return pre
  }, board)

  return {
    users: Users.find({}).fetch(),
    board
  }
}, App)