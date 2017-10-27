/* eslint-disable */
import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import { isEqual } from 'lodash';
import { Link } from 'react-router-dom';
import Twilio from 'twilio-video'

import ReactDOM from 'react-dom'

class App extends Component {
  constructor () {
    super()
    this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2I0NjMwYTFiODFkOGNhYTBjZjk1MjYyODAyNDY5ODVkLTE1MDkxMjQ1NjciLCJncmFudHMiOnsiaWRlbnRpdHkiOiItMSIsInZpZGVvIjp7fX0sImlhdCI6MTUwOTEyNDU2NywiZXhwIjoxNTA5MTI4MTY3LCJpc3MiOiJTS2I0NjMwYTFiODFkOGNhYTBjZjk1MjYyODAyNDY5ODVkIiwic3ViIjoiQUNiMDBjZDY3YmUxNjU5YzhiZDAwYTg4ZDczZThiMmMyNSJ9.7leJhn3uDTqkplkzf_LkdX59VbmOi7xjmDLsVGw8Rjk'
    this.state = {
      students: [],
      studentToRender: null
    }

    this.twilioMounted = false
    this.viewScreen = this.viewScreen.bind(this)
    axios.get('http://8ea090c1.ngrok.io/users')
      .then((res) => {
        if(!isEqual(this.state.students, res)) {
          this.setState({students: res.data})
        }
      })

    //axios.get(`http://8ea090c1.ngrok.io/token?identity=${-1}`)
    //  .then((res) => {
    //    this.token = res.data.token
    //  })
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.students.length > 0 && !this.twilioMounted) {
      Twilio.connect(this.token, { name: 'inst-capture' })
        .then(room => {
          room.on('trackAdded', (track, participant) => {
            let updatedStudent = this.state.students[parseInt(participant.identity)]
            updatedStudent.trackStream = track
            let newStudents = this.state.students
            newStudents[parseInt(participant.identity)] = updatedStudent
            this.setState({ students: newStudents })
          })

          room.on('participantConnected', (participant) => {
            console.log('participant connect', participant.identity)
            const identity = parseInt(participant.identity)
            if (identity !== -1) {
              let newStudents = this.state.students
              newStudents[identity] = { ...newStudents[identity], isActive: true }
              this.setState({ students: newStudents })
            }
          })

          room.on('participantDisconnected', (participant) => {
            console.log('participant disconnect', participant.identity)
            const identity = parseInt(participant.identity)
            if (identity !== -1) {
              let newStudents = this.state.students
              newStudents[identity] = { ...newStudents[identity], isActive: false }
              this.setState({ students: newStudents })
            }
          })

          console.log('Connected to Room "%s"', room.name);
        })
        .catch(e => {
          console.log('error', e)
        });

      this.twilioMounted = true
    }
  }

  renderStudent (id) {
    return () => {
      if (this.state.studentToRender === id) {
        this.setState({ studentToRender: null })
      } else {
        this.setState({ studentToRender: id })
      }
    }
  }

  viewScreen () {
    const studentToWatch = this.state.students[this.state.studentToRender]
    console.log('stw', studentToWatch, this.video)
    studentToWatch.trackStream.attach(this.video)
  }

  renderStudentInfo () {
    if (this.state.studentToRender === null) return null
    const student = this.state.students[this.state.studentToRender]
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <a className="link dim black b f1 f-headline-ns tc db mb3 mb4-ns" title="Student">{student.name}</a>
          <a
            onClick={this.viewScreen}
            className="f6 link dim ba bw2 ph3 pv2 mb2 dib black center" href="#0">See Screen</a>
          <video ref={(e) => this.video = e } style={{ width: '100%', height: '100%' }}></video>
        </div>
    )
  }

  studentCard (student) {
    const style = {
      display: 'float',
      opacity: student.isActive ? 1 : .4,
      width: '200px',
    }

    return (
        <div key={student.id} style={style} onClick={this.renderStudent(student.id)}>
          <div className="tc">
            <img src="http://tachyons.io/img/avatar_1.jpg"
              className="br-100 h4 w4 dib ba b--black-05 pa2" title="Photo of a kitty staring at you"></img>
            <h1 className="f3 mb2">{student.name}</h1>
            <h2 className="f5 fw4 gray mt0">Student</h2>
          </div>
        </div>
    );
  }

  renderCards() {
    return this.state.students.map((student) => this.studentCard(student));
  }

  render() {
    if (this.state.students.length <= 0) { return <div>No students</div> }
    return (
      <div>
        <div style={{ display: 'flex' }} className="App">
          {this.renderCards()}
        </div>
        {this.renderStudentInfo()}
      </div>
    );
  }
}

export default App;
