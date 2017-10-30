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
    this.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzQxNWQ1YTBlNGZlMzFlMTA4ZDI1YWI5YzE0NWY4MWI1LTE1MDkxNDMwOTQiLCJpc3MiOiJTSzQxNWQ1YTBlNGZlMzFlMTA4ZDI1YWI5YzE0NWY4MWI1Iiwic3ViIjoiQUNiMDBjZDY3YmUxNjU5YzhiZDAwYTg4ZDczZThiMmMyNSIsImV4cCI6MTUwOTE0NjY5NCwiZ3JhbnRzIjp7ImlkZW50aXR5IjoiLTEiLCJ2aWRlbyI6eyJyb29tIjoiaW5zdC1jYXB0dXJlIn19fQ.FnO9i0sAp0GTqxctxjCQGBGIITczqH8p6dNaNuoaP3Q'
    this.state = {
      students: [],
      studentToRender: null,
      seeActivity: null
    }

    this.twilioMounted = false
    this.viewScreen = this.viewScreen.bind(this)
    axios.get('http://19e96859.ngrok.io/users')
      .then((res) => {
        if(!isEqual(this.state.students, res)) {
          this.setState({students: res.data})
        }
      })

    //axios.get(`http://19e96859.ngrok.io/token?identity=${-1}`)
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
      if (!this.state.students[id].isActive) return null
      if (this.state.studentToRender === id) {
        this.setState({ studentToRender: null })
      } else {
        this.setState({ studentToRender: id })
      }
    }
  }

  viewScreen () {
    if (this.state.seeScreen) {
      this.setState({ seeScreen: null })
      this.state.students[this.state.studentToRender].trackStream.detach()
    } else {
      this.setState({ seeActivity: null, seeScreen: this.state.studentToRender })
      const studentToWatch = this.state.students[this.state.studentToRender]
      studentToWatch.trackStream.attach(this.video)
    }
  }

  viewActivity (id) {
    return () => {
      if (this.state.seeActivity) {
        this.setState({ seeScreen: null, seeActivity: null })
      } else {
        this.setState({ seeScreen: null, seeActivity: id })
        axios.get(`http://19e96859.ngrok.io/events/${id}`)
          .then((res) => {
            let newStudents = this.state.students
            newStudents[id] = { ...newStudents[id], events: res.data.events }
            this.setState({ students: newStudents })

          })
        setInterval(() => {
          axios.get(`http://19e96859.ngrok.io/events/${id}`)
            .then((res) => {
              let newStudents = this.state.students
              newStudents[id] = { ...newStudents[id], events: res.data.events }
              this.setState({ students: newStudents })
            })
        }, 10000)
      }
    }
  }

  blockSite (entity) {
    return () => {
      axios.post(`http://19e96859.ngrok.io/block`, { id: this.state.students[this.state.seeActivity].id, url: entity })
    }
  }

  renderActivity () {
    if (!this.state.seeActivity) return null
    return (
        <div className="pa4">
  <div className="overflow-auto">
    <table className="f6 w-100 mw8 center" cellspacing="0">
      <thead>
        <tr className="stripe-dark">
          <th className="fw6 tl pa3 bg-white">Page</th>
          <th className="fw6 tl pa3 bg-white">Time on Page</th>
          <th className="fw6 tl pa3 bg-white">Last Visited</th>
          <th className="fw6 tl pa3 bg-white">Action</th>
        </tr>
      </thead>
      <tbody className="lh-copy">
        { this.state.students[this.state.seeActivity].events.map((e) => {
          return (
            <tr key={e.entity} className="stripe-dark">
              <td className="pa3">{e.entity}</td>
              <td className="pa3">{e.timeOnSite}</td>
              <td className="pa3">{e.timestamp}</td>
              <a onClick={this.blockSite(e.entity)} className="f6 link dim br1 ph3 pv2 mb2 dib white bg-navy mt2" href="#0">Block Site</a>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
</div>
    )
  }

  renderStudentInfo () {
    if (this.state.studentToRender === null) return null
    const student = this.state.students[this.state.studentToRender]
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <a className="link dim black b f1 f-headline-ns tc db mb3 mb4-ns" title="Student">{student.name}</a>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <a
            onClick={this.viewScreen}
            className="f6 link dim ba bw2 ph3 pv2 mb2 dib black center" href="#0">{ this.state.seeScreen ? 'Stop Screen' : 'See Screen'}</a>
          <a
            onClick={this.viewActivity(student.id)}
            className="f6 link dim ba bw2 ph3 pv2 mb2 dib black center" href="#0">{this.state.seeActivity ? 'Hide Activity' : 'See Activity'}</a>
          </div>
          {this.renderActivity()}
          <video ref={(e) => this.video = e } style={{ width: '100%', height: '100%' }}></video>
        </div>
    )
  }

  studentCard (student) {
    const style = {
      display: 'float',
      opacity: student.isActive ? 1 : .4,
      width: '200px',
      cursor: student.isActive ? 'pointer' : ''
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
        <h1 className="f3 mb2">Google Classroom Adminstration</h1>
        <div style={{ display: 'flex' }} className="App">
          {this.renderCards()}
        </div>
        {this.renderStudentInfo()}
      </div>
    );
  }
}

export default App;
