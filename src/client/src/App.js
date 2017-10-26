/* eslint-disable */
import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import {isEqual} from 'lodash';

class App extends Component {
  constructor() {
    super();
    this.state = {students: [,
      {
      name: "Matt Neldam",
      id: 0,
      loggedIn: false,
    },
    {
      name: "Chris Whitten",
      id: 1,
      loggedIn: false,
    },
  ]}
  // define a polling function, sends an HTTP request to the server
  setInterval(() => {
    axios.get('/users')
      .then((res) => {
        console.log(res.data);
        if(!isEqual(this.state.students, res)) {
          this.setState({students: res.data})
        }
      })
  }, 2000);
}

  studentCard(studentInfo) {
    const style = {
      opacity: studentInfo.loggedIn ? 1 : .4,
      backgroundColor: 'grey',
      width: '100px',
      height: '80px',
    }
    return (
      <div key={studentInfo.id} style={style}>
        {studentInfo.name}
      </div>
    );
  }

  getCards() {
    return this.state.students.map((student) => this.studentCard(student));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
          {this.getCards()}
      </div>
    );
  }
}

export default App;
