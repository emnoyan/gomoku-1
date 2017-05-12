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

  constructor(props) {
    super(props)
    this.state = {
      user: undefined
    }
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {
    if(!this.state.user) {
      this.registerUser(nextProps.users)
    }
  }

  isGameReady() {
    const { roomId } = this.props.match.params 
    const circle = this.props.users.filter(user => user.roomId === roomId && user.type === 'circle')
    const cross = this.props.users.filter(user => user.roomId === roomId && user.type === 'cross')
    return circle.length == 1 && cross.length == 1
  }

  registerUser(userList) {
    const { roomId } = this.props.match.params 
    const users = userList.filter(user => user.roomId === roomId)
    console.log('users', users.length)
    let type = 'view'
    if(users.length === 0) {
      type = 'circle'
    } else if(users.length === 1) {
      type = 'cross'
    }
    
    const user = {
      userId: Random.id(),
      type,
      roomId,
      createdAt: new Date()
    }

    Users.insert({
      ...user
    });

    globalUserId = user.userId
    this.setState({ user })
  }

  handleCellClick(row, col) {
    const { roomId } = this.props.match.params
    if(!this.isGameReady() // not enough 2 player
      || this.props.board[row][col] // the cell didn't check
      || this.state.user.type === 'view' // not a viewer
      || (this.props.selections.length > 0 && this.props.selections[0].type === this.state.user.type)) { // not a last player checked
      return;
    }
    Selections.insert({
      type: this.state.user.type,
      row,
      col,
      roomId,
      createdAt: new Date()
    });
  }

  resetGame() {
    Meteor.call('selections.remove');
  }

  renderBoard() {
    return [...Array(BOARD_SIZE).keys()].map(row => (
      <div className="boardRow">
      {[...Array(BOARD_SIZE).keys()].map(col => (
        <div className="boardCol">
          <div className={"boardCell" + (this.props.board[row][col]? (this.props.board[row][col] === 'circle'? ' boardCellCircle' : ' boardCellCross'): '')} id={row + "-" + col} key={row + "-" + col} onClick={this.handleCellClick.bind(this, row, col)}>
          </div>
        </div>
        ))}
      </div>));
  }

  renderUserList() {
    const { roomId } = this.props.match.params 
    return this.props.users.filter(user => user.roomId === roomId).map(user => (<li>{(user.userId === this.state.user.userId ? 'You':'Guest_' + user.userId) + ': ' + user.type}</li>));
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
              <div className="newMainText">{this.isGameReady() ? 'Game is ready. Let go!' : 'Wait for friend'}</div>
            </div>
          </div>
        </div>
        <div className="board">
            {this.renderBoard()}
        </div>
        <div className="usersList">
            {this.renderUserList()}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  board: PropTypes.array.isRequired,
};

export default createContainer((props) => {
  const { roomId } = props.match.params 
  let board = new Array(BOARD_SIZE)
  for(let i=0; i< BOARD_SIZE; i++) {
    board[i] = new Array(BOARD_SIZE)
  }
  const selections = Selections.find({roomId}, { sort: { createdAt: -1 }}).fetch()
  board = selections.reduce((pre, item) => {
    pre[item.row][item.col] = item.type
    return pre
  }, board)

  return {
    users: Users.find({}).fetch(),
    selections,
    board
  }
}, App)